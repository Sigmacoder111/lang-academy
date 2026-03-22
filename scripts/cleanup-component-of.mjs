#!/usr/bin/env node
/**
 * Cleanup script: removes "component of" questions and "NOT a radical" questions
 * from problem-bank.ts and multisteps.ts
 */

import { readFileSync, writeFileSync } from "fs";

// --- Pool of real Chinese word meanings for replacing "component of X" distractors ---
const REAL_MEANINGS = [
  "to fish", "Mount Tai", "younger brother", "debt", "to celebrate", "paper",
  "individual/personal", "prison", "society/organization", "intelligent/clever",
  "beside/next to", "color", "east", "door/gate", "north", "to pour/fall",
  "loan", "to graduate", "war", "dragon", "passport", "morality/ethics",
  "temperate zone", "warranty", "to exceed/the more", "middle school",
  "carbon emissions", "excited", "food safety", "neat/even", "monsoon",
  "one-sided", "doctorate/Ph.D.", "to pick up", "to vote", "clean/pure",
  "competition/match", "to compensate", "cross-talk comedy", "gene",
  "to create/initiate", "to regret", "to announce/declare", "often/frequently",
  "situation/condition", "to break/broken", "waiter/attendant", "complaint",
  "deep/profound", "unique/distinctive", "rich/wealthy", "to criticize",
  "topic/question", "front/before", "safe/peaceful", "temperament/aura",
  "to dare", "magazine", "to shrink/reduce", "to contact/connection",
  "education", "Go (board game)", "to analyze", "skill/technology",
  "to move/carry", "quality/nature", "wood/tree", "Assignment/duty",
  "to discover", "to trust", "shadow", "furniture", "customer", "danger",
  "butterfly", "thunder", "sugar", "blanket", "vacation", "century",
  "planet", "harbor", "mystery", "courage", "oxygen", "envelope",
  "gravity", "algebra", "rhythm", "mirror", "sculpture", "volcano",
  "diamond", "horizon", "melody", "architecture", "philosophy", "satellite",
  "calendar", "champion", "festival", "uniform", "biography", "telescope",
  "currency", "ancestor", "ceremony", "dinosaur", "elephant", "fountain",
  "garden", "heritage", "island", "journal", "kingdom", "landscape",
  "monument", "navigate", "orchestra", "paradise", "quantity", "republic",
  "strategy", "treasure", "universe", "vegetable", "whisper", "pyramid",
  "ancient", "brilliant", "cautious", "delicate", "elegant", "frequent",
  "generous", "humble", "innocent", "joyful", "loyal", "mature",
  "noble", "ordinary", "patient", "reliable", "sincere", "tender",
  "valuable", "wise", "ambitious", "bitter", "complex", "distant",
  "eternal", "fragile", "genuine", "hollow", "intense", "keen",
  "mild", "narrow", "obscure", "precise", "rapid", "shallow",
  "thick", "urgent", "vivid", "wealthy", "blaze", "cliff",
  "deputy", "feast", "gravel", "harbor", "ivory", "jungle",
  "kernel", "lumber", "marble", "needle", "orchid", "plunge",
];

function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296;
  };
}

function isComponentOf(str) {
  return typeof str === "string" && str.toLowerCase().startsWith("component of");
}

function hasComponentOf(str) {
  return typeof str === "string" && str.toLowerCase().includes("component of");
}

function isNotARadicalQuestion(problem) {
  return typeof problem.question === "string" &&
    problem.question.includes("NOT a radical");
}

function isComponentQuestion(problem) {
  return typeof problem.question === "string" && hasComponentOf(problem.question);
}

function isComponentAnswer(problem) {
  if (!Array.isArray(problem.options)) return false;
  const correctOption = problem.options[problem.correctIndex];
  return isComponentOf(correctOption);
}

// --- Process problem-bank.ts ---
function processProblemBank() {
  const filePath = "src/data/problem-bank.ts";
  const content = readFileSync(filePath, "utf-8");

  const importLine = content.match(/^import .+;\n/)?.[0] || "";
  const match = content.match(/export const PROBLEM_BANK:\s*ProblemBankEntry\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) {
    console.error("Could not parse problem-bank.ts");
    return;
  }

  const data = JSON.parse(match[1]);
  const rng = seededRandom("cleanup-v1");

  let removedProblems = 0;
  let removedEntries = 0;
  let replacedDistractors = 0;

  const cleanedData = [];

  for (const entry of data) {
    const cleanedProblems = [];

    for (const problem of entry.problems) {
      // Remove "Which one is NOT a radical?" questions
      if (isNotARadicalQuestion(problem)) {
        removedProblems++;
        continue;
      }

      // Remove questions that ask about "component of" in the question text
      if (isComponentQuestion(problem)) {
        removedProblems++;
        continue;
      }

      // Remove questions where correct answer is "component of X"
      if (isComponentAnswer(problem)) {
        removedProblems++;
        continue;
      }

      // Replace "component of" distractor options with real meanings
      const otherOptions = problem.options.filter((_, i) => i !== problem.correctIndex);
      const correctOption = problem.options[problem.correctIndex];
      let modified = false;

      const newOptions = problem.options.map((opt, idx) => {
        if (idx === problem.correctIndex) return opt;
        if (isComponentOf(opt)) {
          replacedDistractors++;
          modified = true;
          // Pick a replacement that doesn't duplicate other options
          const existingOptions = new Set(problem.options.map(o => o.toLowerCase()));
          existingOptions.delete(opt.toLowerCase());
          let replacement;
          let attempts = 0;
          do {
            replacement = REAL_MEANINGS[Math.floor(rng() * REAL_MEANINGS.length)];
            attempts++;
          } while (existingOptions.has(replacement.toLowerCase()) && attempts < 50);
          return replacement;
        }
        return opt;
      });

      if (modified) {
        // Recalculate correct index since we didn't move it
        const newCorrectIndex = newOptions.indexOf(correctOption);
        cleanedProblems.push({
          ...problem,
          options: newOptions,
          correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : problem.correctIndex,
        });
      } else {
        cleanedProblems.push(problem);
      }
    }

    if (cleanedProblems.length > 0) {
      cleanedData.push({ ...entry, problems: cleanedProblems });
    } else {
      removedEntries++;
    }
  }

  const output = `${importLine}\nexport const PROBLEM_BANK: ProblemBankEntry[] = ${JSON.stringify(cleanedData, null, 2)};\n`;
  writeFileSync(filePath, output);

  console.log(`problem-bank.ts cleanup:`);
  console.log(`  Removed ${removedProblems} problems`);
  console.log(`  Removed ${removedEntries} empty entries`);
  console.log(`  Replaced ${replacedDistractors} "component of" distractors`);
  console.log(`  Remaining entries: ${cleanedData.length}`);
  console.log(`  Remaining problems: ${cleanedData.reduce((s, e) => s + e.problems.length, 0)}`);
}

// --- Process multisteps.ts ---
function processMultisteps() {
  const filePath = "src/data/multisteps.ts";
  const content = readFileSync(filePath, "utf-8");

  const importLine = content.match(/^import .+;\n/)?.[0] || "";
  const match = content.match(/export const MULTISTEP_SCENARIOS:\s*MultistepScenario\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) {
    console.error("Could not parse multisteps.ts");
    return;
  }

  const data = JSON.parse(match[1]);

  let removedSteps = 0;
  let removedScenarios = 0;

  const cleanedData = [];

  for (const scenario of data) {
    const cleanedSteps = [];

    for (const step of scenario.steps) {
      const hasComponentInQuestion = hasComponentOf(step.question);
      const hasComponentInOptions = step.options.some(isComponentOf);
      const hasComponentInExplanation = hasComponentOf(step.explanation);
      const hasComponentInCorrectAnswer = isComponentOf(step.options[step.correctIndex]);

      // Remove steps where the question asks about "component of"
      // or where the correct answer is "component of X"
      // or where the explanation references "component of"
      if (hasComponentInQuestion || hasComponentInCorrectAnswer || hasComponentInExplanation) {
        removedSteps++;
        continue;
      }

      // For steps with "component of" only in wrong options, replace the distractors
      if (hasComponentInOptions) {
        const rng = seededRandom(`ms-${scenario.id}-${cleanedSteps.length}`);
        const newOptions = step.options.map((opt, idx) => {
          if (idx === step.correctIndex) return opt;
          if (isComponentOf(opt)) {
            const existingOptions = new Set(step.options.map(o => o.toLowerCase()));
            let replacement;
            let attempts = 0;
            do {
              replacement = REAL_MEANINGS[Math.floor(rng() * REAL_MEANINGS.length)];
              attempts++;
            } while (existingOptions.has(replacement.toLowerCase()) && attempts < 50);
            return replacement;
          }
          return opt;
        });
        cleanedSteps.push({ ...step, options: newOptions });
      } else {
        cleanedSteps.push(step);
      }
    }

    if (cleanedSteps.length >= 3) {
      cleanedData.push({ ...scenario, steps: cleanedSteps });
    } else {
      removedScenarios++;
    }
  }

  const output = `${importLine}\nexport const MULTISTEP_SCENARIOS: MultistepScenario[] = ${JSON.stringify(cleanedData, null, 2)};\n`;
  writeFileSync(filePath, output);

  console.log(`multisteps.ts cleanup:`);
  console.log(`  Removed ${removedSteps} steps`);
  console.log(`  Removed ${removedScenarios} scenarios (fewer than 3 steps remaining)`);
  console.log(`  Remaining scenarios: ${cleanedData.length}`);
  console.log(`  Remaining steps: ${cleanedData.reduce((s, e) => s + e.steps.length, 0)}`);
}

// --- Run ---
processProblemBank();
processMultisteps();
console.log("\nDone! Verify with: grep -c 'component of' src/data/problem-bank.ts src/data/multisteps.ts");
