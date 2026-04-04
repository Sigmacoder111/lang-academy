import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI();
  }
  return _openai;
}

type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
type Model = "tts-1" | "tts-1-hd";

interface ManifestEntry {
  text: string;
  voice: Voice;
  model: Model;
  speed: number;
  generatedAt: string;
}

interface AudioManifest {
  version: number;
  entries: Record<string, ManifestEntry>;
}

const MANIFEST_PATH = path.join(__dirname, "audio-manifest.json");
const AUDIO_ROOT = path.join(__dirname, "..", "public", "audio");

const VOICE_CONFIG = {
  vocab: { voice: "nova" as Voice, model: "tts-1" as Model },
  sentence: { voice: "nova" as Voice, model: "tts-1-hd" as Model },
  dialogueA: { voice: "nova" as Voice, model: "tts-1-hd" as Model },
  dialogueB: { voice: "onyx" as Voice, model: "tts-1-hd" as Model },
  conversationPrompt: { voice: "onyx" as Voice, model: "tts-1-hd" as Model },
} as const;

const RATE_LIMIT_DELAY_MS = 200;

function loadManifest(): AudioManifest {
  if (fs.existsSync(MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  }
  return { version: 1, entries: {} };
}

function saveManifest(manifest: AudioManifest): void {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function needsRegeneration(
  manifest: AudioManifest,
  key: string,
  text: string,
  voice: Voice,
  model: Model,
  speed: number
): boolean {
  const entry = manifest.entries[key];
  if (!entry) return true;
  return (
    entry.text !== text ||
    entry.voice !== voice ||
    entry.model !== model ||
    entry.speed !== speed
  );
}

async function generateAudio(
  text: string,
  voice: Voice,
  model: Model,
  outputPath: string,
  speed: number = 1.0
): Promise<void> {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const response = await getOpenAI().audio.speech.create({
    model,
    voice,
    input: text,
    speed,
    response_format: "mp3",
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface GraphNode {
  id: string;
  type: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  lesson: {
    workedExample: { problem: string; solution: string };
  };
}

interface DialogueLine {
  speaker: "A" | "B";
  text: string;
  pinyin: string;
}

interface ListeningExercise {
  type: string;
  id: string;
  audioText?: string;
  lines?: DialogueLine[];
}

async function loadGraphNodes(): Promise<GraphNode[]> {
  const graphPath = path.join(__dirname, "..", "src", "data", "graph.ts");
  const content = fs.readFileSync(graphPath, "utf-8");

  const match = content.match(/export const GRAPH:\s*GraphNode\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/m);
  if (!match) {
    const arrayStart = content.indexOf("[");
    if (arrayStart === -1) throw new Error("Could not find GRAPH array in graph.ts");
    const arrayContent = content.slice(arrayStart);
    return JSON.parse(arrayContent);
  }
  return JSON.parse(match[1]);
}

async function loadListeningExercises(): Promise<ListeningExercise[]> {
  const filePath = path.join(__dirname, "..", "src", "data", "listening-exercises.ts");
  const content = fs.readFileSync(filePath, "utf-8");

  const exercises: ListeningExercise[] = [];

  const vocabRegex = /\{\s*type:\s*"vocabulary",\s*id:\s*"([^"]+)",\s*audioText:\s*"([^"]+)"/g;
  let m;
  while ((m = vocabRegex.exec(content)) !== null) {
    exercises.push({ type: "vocabulary", id: m[1], audioText: m[2] });
  }

  const sentenceRegex = /\{\s*type:\s*"sentence",\s*id:\s*"([^"]+)",\s*audioText:\s*"([^"]+)"/g;
  while ((m = sentenceRegex.exec(content)) !== null) {
    exercises.push({ type: "sentence", id: m[1], audioText: m[2] });
  }

  const dictationRegex = /\{\s*type:\s*"dictation",\s*id:\s*"([^"]+)",\s*audioText:\s*"([^"]+)"/g;
  while ((m = dictationRegex.exec(content)) !== null) {
    exercises.push({ type: "dictation", id: m[1], audioText: m[2] });
  }

  const dialogueBlocks = content.match(/\{\s*type:\s*"dialogue"[\s\S]*?questions:\s*\[[\s\S]*?\]\s*,?\s*\}/g) || [];
  for (const block of dialogueBlocks) {
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    if (!idMatch) continue;

    const lines: DialogueLine[] = [];
    const lineRegex = /\{\s*speaker:\s*"([AB])",\s*text:\s*"([^"]+)",\s*pinyin:\s*"([^"]+)"\s*\}/g;
    let lm;
    while ((lm = lineRegex.exec(block)) !== null) {
      lines.push({
        speaker: lm[1] as "A" | "B",
        text: lm[2],
        pinyin: lm[3],
      });
    }

    exercises.push({
      type: "dialogue",
      id: idMatch[1],
      lines,
    });
  }

  return exercises;
}

async function generateVocabAudio(
  nodes: GraphNode[],
  manifest: AudioManifest,
  dryRun: boolean
): Promise<number> {
  let generated = 0;
  const { voice, model } = VOICE_CONFIG.vocab;

  console.log(`\n📚 Generating vocabulary audio for ${nodes.length} nodes...`);

  for (const node of nodes) {
    const key = `vocab/${node.id}`;
    const outputPath = path.join(AUDIO_ROOT, "vocab", `${node.id}.mp3`);

    if (!needsRegeneration(manifest, key, node.hanzi, voice, model, 1.0)) {
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would generate: ${key} — "${node.hanzi}"`);
      generated++;
      continue;
    }

    try {
      await generateAudio(node.hanzi, voice, model, outputPath, 1.0);
      manifest.entries[key] = {
        text: node.hanzi,
        voice,
        model,
        speed: 1.0,
        generatedAt: new Date().toISOString(),
      };
      generated++;
      if (generated % 50 === 0) {
        console.log(`  ✓ ${generated} vocab files generated...`);
        saveManifest(manifest);
      }
      await delay(RATE_LIMIT_DELAY_MS);
    } catch (err) {
      console.error(`  ✗ Failed to generate ${key}: ${err}`);
    }
  }

  console.log(`  ✓ Vocabulary: ${generated} new files generated`);
  return generated;
}

async function generateSentenceAudio(
  nodes: GraphNode[],
  manifest: AudioManifest,
  dryRun: boolean
): Promise<number> {
  let generated = 0;
  const { voice, model } = VOICE_CONFIG.sentence;

  console.log(`\n📝 Generating sentence audio for ${nodes.length} nodes...`);

  for (const node of nodes) {
    const exampleText = node.lesson.workedExample.problem;
    const chineseMatch = exampleText.match(/[\u4e00-\u9fff\uff0c\u3002\uff01\uff1f]+/);
    if (!chineseMatch) continue;

    const chineseText = chineseMatch[0];
    const key = `sentences/${node.id}`;
    const outputPath = path.join(AUDIO_ROOT, "sentences", `${node.id}.mp3`);

    if (!needsRegeneration(manifest, key, chineseText, voice, model, 1.0)) {
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would generate: ${key} — "${chineseText}"`);
      generated++;
      continue;
    }

    try {
      await generateAudio(chineseText, voice, model, outputPath, 1.0);
      manifest.entries[key] = {
        text: chineseText,
        voice,
        model,
        speed: 1.0,
        generatedAt: new Date().toISOString(),
      };
      generated++;
      if (generated % 50 === 0) {
        console.log(`  ✓ ${generated} sentence files generated...`);
        saveManifest(manifest);
      }
      await delay(RATE_LIMIT_DELAY_MS);
    } catch (err) {
      console.error(`  ✗ Failed to generate ${key}: ${err}`);
    }
  }

  console.log(`  ✓ Sentences: ${generated} new files generated`);
  return generated;
}

async function generateListeningAudio(
  exercises: ListeningExercise[],
  manifest: AudioManifest,
  dryRun: boolean
): Promise<number> {
  let generated = 0;

  console.log(`\n🎧 Generating listening exercise audio for ${exercises.length} exercises...`);

  for (const exercise of exercises) {
    if (exercise.type === "dialogue" && exercise.lines) {
      for (let i = 0; i < exercise.lines.length; i++) {
        const line = exercise.lines[i];
        const config = line.speaker === "A" ? VOICE_CONFIG.dialogueA : VOICE_CONFIG.dialogueB;
        const key = `listening/${exercise.id}_line${i}`;
        const outputPath = path.join(AUDIO_ROOT, "listening", `${exercise.id}_line${i}.mp3`);

        if (!needsRegeneration(manifest, key, line.text, config.voice, config.model, 1.0)) {
          continue;
        }

        if (dryRun) {
          console.log(`  [DRY RUN] Would generate: ${key} — Speaker ${line.speaker}: "${line.text}"`);
          generated++;
          continue;
        }

        try {
          await generateAudio(line.text, config.voice, config.model, outputPath, 1.0);
          manifest.entries[key] = {
            text: line.text,
            voice: config.voice,
            model: config.model,
            speed: 1.0,
            generatedAt: new Date().toISOString(),
          };
          generated++;
          await delay(RATE_LIMIT_DELAY_MS);
        } catch (err) {
          console.error(`  ✗ Failed to generate ${key}: ${err}`);
        }
      }
    } else if (exercise.audioText) {
      const config = VOICE_CONFIG.sentence;

      // Normal speed
      const key = `listening/${exercise.id}`;
      const outputPath = path.join(AUDIO_ROOT, "listening", `${exercise.id}.mp3`);

      if (needsRegeneration(manifest, key, exercise.audioText, config.voice, config.model, 1.0)) {
        if (dryRun) {
          console.log(`  [DRY RUN] Would generate: ${key} — "${exercise.audioText}"`);
        } else {
          try {
            await generateAudio(exercise.audioText, config.voice, config.model, outputPath, 1.0);
            manifest.entries[key] = {
              text: exercise.audioText,
              voice: config.voice,
              model: config.model,
              speed: 1.0,
              generatedAt: new Date().toISOString(),
            };
            generated++;
            await delay(RATE_LIMIT_DELAY_MS);
          } catch (err) {
            console.error(`  ✗ Failed to generate ${key}: ${err}`);
          }
        }
      }

      // Slow speed (0.75x)
      const slowKey = `listening/${exercise.id}_slow`;
      const slowOutputPath = path.join(AUDIO_ROOT, "listening", `${exercise.id}_slow.mp3`);

      if (needsRegeneration(manifest, slowKey, exercise.audioText, config.voice, config.model, 0.75)) {
        if (dryRun) {
          console.log(`  [DRY RUN] Would generate: ${slowKey} — "${exercise.audioText}" (slow)`);
        } else {
          try {
            await generateAudio(exercise.audioText, config.voice, config.model, slowOutputPath, 0.75);
            manifest.entries[slowKey] = {
              text: exercise.audioText,
              voice: config.voice,
              model: config.model,
              speed: 0.75,
              generatedAt: new Date().toISOString(),
            };
            generated++;
            await delay(RATE_LIMIT_DELAY_MS);
          } catch (err) {
            console.error(`  ✗ Failed to generate ${slowKey}: ${err}`);
          }
        }
      }
    }
  }

  console.log(`  ✓ Listening: ${generated} new files generated`);
  return generated;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const vocabOnly = args.includes("--vocab-only");
  const listeningOnly = args.includes("--listening-only");
  const sentencesOnly = args.includes("--sentences-only");
  const dryRun = args.includes("--dry-run");

  if (!process.env.OPENAI_API_KEY && !dryRun) {
    console.error("❌ OPENAI_API_KEY environment variable is required.");
    console.error("   Set it with: export OPENAI_API_KEY=sk-...");
    process.exit(1);
  }

  console.log("🔊 Audio Generation Pipeline");
  console.log("============================");
  if (dryRun) console.log("🏃 DRY RUN — no files will be generated\n");

  for (const dir of ["vocab", "sentences", "listening", "speaking"]) {
    const dirPath = path.join(AUDIO_ROOT, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  const manifest = loadManifest();
  let totalGenerated = 0;

  try {
    if (!listeningOnly && !sentencesOnly) {
      const nodes = await loadGraphNodes();
      console.log(`📊 Found ${nodes.length} graph nodes`);
      totalGenerated += await generateVocabAudio(nodes, manifest, dryRun);
    }

    if (!vocabOnly && !listeningOnly) {
      const nodes = await loadGraphNodes();
      totalGenerated += await generateSentenceAudio(nodes, manifest, dryRun);
    }

    if (!vocabOnly && !sentencesOnly) {
      const exercises = await loadListeningExercises();
      console.log(`📊 Found ${exercises.length} listening exercises`);
      totalGenerated += await generateListeningAudio(exercises, manifest, dryRun);
    }
  } finally {
    if (!dryRun) {
      saveManifest(manifest);
    }
  }

  console.log(`\n✅ Done! ${totalGenerated} audio files generated.`);
  console.log(`📁 Audio files in: ${AUDIO_ROOT}`);
  console.log(`📋 Manifest saved to: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
