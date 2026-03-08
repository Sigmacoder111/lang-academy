/**
 * Main pipeline orchestrator.
 * Runs all stages and writes output files.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { importHSKVocabulary } from "./stage1-import";
import { generatePrereqs } from "./stage2-prereqs";
import { generateLessons } from "./stage3-lessons";
import { generateProblemBank } from "./stage4-problems";
import { generateMultistepScenarios } from "./stage5-multisteps";
import { addAPThemes } from "./stage6-themes";
import { validatePipeline } from "./validate";
import type { GraphNode, ProblemBankEntry, MultistepScenario } from "../../src/types/graph";

const ROOT = join(import.meta.dirname, "..", "..");
const DATA_DIR = join(ROOT, "src", "data");

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function writeGraphFile(nodes: GraphNode[]) {
  const lines = [
    `import type { GraphNode } from "../types/graph";`,
    ``,
    `export const GRAPH: GraphNode[] = ${JSON.stringify(nodes, null, 2)};`,
    ``,
  ];
  writeFileSync(join(DATA_DIR, "graph.ts"), lines.join("\n"), "utf-8");
}

function writeProblemBankFile(bank: ProblemBankEntry[]) {
  const lines = [
    `import type { ProblemBankEntry } from "../types/graph";`,
    ``,
    `export const PROBLEM_BANK: ProblemBankEntry[] = ${JSON.stringify(bank, null, 2)};`,
    ``,
  ];
  writeFileSync(join(DATA_DIR, "problem-bank.ts"), lines.join("\n"), "utf-8");
}

function writeMultistepsFile(scenarios: MultistepScenario[]) {
  const lines = [
    `import type { MultistepScenario } from "../types/graph";`,
    ``,
    `export const MULTISTEP_SCENARIOS: MultistepScenario[] = ${JSON.stringify(scenarios, null, 2)};`,
    ``,
  ];
  writeFileSync(join(DATA_DIR, "multisteps.ts"), lines.join("\n"), "utf-8");
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Chinese Academy Curriculum Pipeline");
  console.log("═══════════════════════════════════════════════════\n");

  const startTime = Date.now();

  // Stage 1: Import
  console.log("Stage 1: Importing HSK vocabulary...");
  const rawNodes = importHSKVocabulary();
  console.log();

  // Stage 2: Prerequisites
  console.log("Stage 2: Generating prerequisite edges...");
  const nodesWithPrereqs = generatePrereqs(rawNodes);
  console.log();

  // Stage 3: Lessons
  console.log("Stage 3: Generating lesson content...");
  const nodesWithLessons = generateLessons(nodesWithPrereqs);
  console.log();

  // Stage 4: Problem Bank
  console.log("Stage 4: Generating review/quiz problem bank...");
  const problemBank = generateProblemBank(nodesWithLessons);
  console.log();

  // Stage 5: Multistep Scenarios
  console.log("Stage 5: Generating multistep scenarios...");
  const multisteps = generateMultistepScenarios(nodesWithLessons);
  console.log();

  // Stage 6: AP Themes
  console.log("Stage 6: Adding AP theme tags...");
  const themedNodes = addAPThemes(nodesWithLessons);
  console.log();

  // Convert to final GraphNode format
  const graphNodes: GraphNode[] = themedNodes.map(n => ({
    id: n.id,
    type: n.type,
    hanzi: n.hanzi,
    pinyin: n.pinyin,
    meaning: n.meaning,
    prereqs: n.prereqs,
    hskLevel: n.hskLevel,
    themes: n.themes,
    lesson: n.lesson,
  }));

  // Validate
  console.log("Validating pipeline output...");
  const validation = validatePipeline(graphNodes, problemBank, multisteps);
  console.log();

  if (validation.errors.length > 0) {
    console.log(`❌ ${validation.errors.length} errors found:`);
    for (const err of validation.errors.slice(0, 20)) {
      console.log(`  • ${err}`);
    }
    if (validation.errors.length > 20) {
      console.log(`  ... and ${validation.errors.length - 20} more`);
    }
    console.log();
  }

  if (validation.warnings.length > 0) {
    console.log(`⚠️  ${validation.warnings.length} warnings:`);
    for (const w of validation.warnings) {
      console.log(`  • ${w}`);
    }
    console.log();
  }

  // Print stats
  console.log("═══════════════════════════════════════════════════");
  console.log("  Pipeline Statistics");
  console.log("═══════════════════════════════════════════════════");
  const s = validation.stats;
  console.log(`  Total nodes:              ${s.totalNodes}`);
  console.log(`  Nodes with lessons:       ${s.nodesWithLessons}`);
  console.log(`  Nodes with tutorials:     ${s.nodesWithTutorial}`);
  console.log(`  Nodes with worked examples: ${s.nodesWithWorkedExample}`);
  console.log(`  Nodes with ≥2 practice:   ${s.nodesWithPracticeProblems}`);
  console.log(`  Min practice problems:    ${s.minPracticeProblems}`);
  console.log(`  Avg practice problems:    ${s.avgPracticeProblems.toFixed(1)}`);
  console.log(`  Total prereq edges:       ${s.totalEdges}`);
  console.log(`  Orphan non-radical nodes: ${s.orphanNodes}`);
  console.log(`  Problem bank problems:    ${s.totalProblemBankProblems}`);
  console.log(`  Min bank per node:        ${s.minBankProblemsPerNode}`);
  console.log(`  Multistep scenarios:      ${s.totalMultisteps}`);
  console.log(`  Avg steps per scenario:   ${s.avgStepsPerMultistep.toFixed(1)}`);
  console.log();
  console.log("  Theme coverage:");
  for (const [theme, count] of Object.entries(s.themeCoverage)) {
    console.log(`    ${theme}: ${count}`);
  }
  console.log();

  // Write output files
  console.log("Writing output files...");
  ensureDir(DATA_DIR);
  writeGraphFile(graphNodes);
  writeProblemBankFile(problemBank);
  writeMultistepsFile(multisteps);
  console.log(`  ✓ src/data/graph.ts (${graphNodes.length} nodes)`);
  console.log(`  ✓ src/data/problem-bank.ts (${problemBank.length} entries)`);
  console.log(`  ✓ src/data/multisteps.ts (${multisteps.length} scenarios)`);
  console.log();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Pipeline completed in ${elapsed}s`);

  if (validation.valid) {
    console.log("✅ All validation checks passed!");
  } else {
    console.log(`❌ Validation failed with ${validation.errors.length} errors`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
