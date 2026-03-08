/**
 * Standalone validation CLI for the generated data files.
 * Run: npm run pipeline:validate
 */

import { GRAPH } from "../../src/data/graph";
import { PROBLEM_BANK } from "../../src/data/problem-bank";
import { MULTISTEP_SCENARIOS } from "../../src/data/multisteps";
import { validatePipeline } from "./validate";

const result = validatePipeline(GRAPH, PROBLEM_BANK, MULTISTEP_SCENARIOS);

console.log("═══════════════════════════════════════════════════");
console.log("  Validation Report");
console.log("═══════════════════════════════════════════════════\n");

if (result.errors.length > 0) {
  console.log(`❌ ${result.errors.length} errors:`);
  for (const err of result.errors.slice(0, 30)) {
    console.log(`  • ${err}`);
  }
  if (result.errors.length > 30) {
    console.log(`  ... and ${result.errors.length - 30} more`);
  }
  console.log();
}

if (result.warnings.length > 0) {
  console.log(`⚠️  ${result.warnings.length} warnings:`);
  for (const w of result.warnings) {
    console.log(`  • ${w}`);
  }
  console.log();
}

const s = result.stats;
console.log(`  Total nodes:              ${s.totalNodes}`);
console.log(`  Nodes with lessons:       ${s.nodesWithLessons}`);
console.log(`  Min practice problems:    ${s.minPracticeProblems}`);
console.log(`  Avg practice problems:    ${s.avgPracticeProblems.toFixed(1)}`);
console.log(`  Problem bank problems:    ${s.totalProblemBankProblems}`);
console.log(`  Min bank per node:        ${s.minBankProblemsPerNode}`);
console.log(`  Multistep scenarios:      ${s.totalMultisteps}`);
console.log(`  Avg steps per scenario:   ${s.avgStepsPerMultistep.toFixed(1)}`);
console.log();

if (result.valid) {
  console.log("✅ All validation checks passed!");
} else {
  console.log(`❌ Validation failed`);
  process.exit(1);
}
