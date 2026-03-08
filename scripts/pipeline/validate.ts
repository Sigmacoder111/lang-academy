/**
 * Validates the complete pipeline output.
 * Checks: DAG acyclicity, no orphans, lesson completeness, problem bank, multistep prereqs.
 */

import type { GraphNode, ProblemBankEntry, MultistepScenario } from "../../src/types/graph";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalNodes: number;
    nodesWithLessons: number;
    nodesWithTutorial: number;
    nodesWithWorkedExample: number;
    nodesWithPracticeProblems: number;
    minPracticeProblems: number;
    avgPracticeProblems: number;
    totalProblemBankProblems: number;
    minBankProblemsPerNode: number;
    totalMultisteps: number;
    avgStepsPerMultistep: number;
    orphanNodes: number;
    totalEdges: number;
    themeCoverage: Record<string, number>;
  };
}

export function validatePipeline(
  graph: GraphNode[],
  problemBank: ProblemBankEntry[],
  multisteps: MultistepScenario[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const ids = new Set<string>();
  const idSet = new Set<string>();

  // 1. Check unique IDs
  for (const node of graph) {
    if (ids.has(node.id)) {
      errors.push(`Duplicate node ID: "${node.id}"`);
    }
    ids.add(node.id);
    idSet.add(node.id);
  }

  // 2. Check all prereqs reference existing nodes
  for (const node of graph) {
    for (const prereq of node.prereqs) {
      if (!idSet.has(prereq)) {
        errors.push(`Node "${node.id}" has unknown prereq "${prereq}"`);
      }
    }
  }

  // 3. Check DAG acyclicity (Kahn's algorithm)
  const adjCount = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const node of graph) {
    adjCount.set(node.id, node.prereqs.filter(p => idSet.has(p)).length);
    for (const prereq of node.prereqs) {
      if (!dependents.has(prereq)) dependents.set(prereq, []);
      dependents.get(prereq)!.push(node.id);
    }
  }

  const queue: string[] = [];
  for (const [id, count] of adjCount) {
    if (count === 0) queue.push(id);
  }

  let visited = 0;
  while (queue.length > 0) {
    const current = queue.shift()!;
    visited++;
    for (const dep of dependents.get(current) ?? []) {
      const remaining = adjCount.get(dep)! - 1;
      adjCount.set(dep, remaining);
      if (remaining === 0) queue.push(dep);
    }
  }

  if (visited !== graph.length) {
    errors.push(`Graph contains circular dependencies (${graph.length - visited} nodes in cycles)`);
  }

  // 4. Check orphan nodes (non-radicals with no prereqs)
  const orphanNodes = graph.filter(n => n.prereqs.length === 0 && n.type !== "radical");
  if (orphanNodes.length > 0) {
    warnings.push(`${orphanNodes.length} non-radical nodes have no prerequisites`);
  }

  // 5. Check lesson content
  let nodesWithTutorial = 0;
  let nodesWithWorkedExample = 0;
  let nodesWithPracticeProblems = 0;
  let nodesWithLessons = 0;
  let minPractice = Infinity;
  let totalPractice = 0;

  for (const node of graph) {
    if (!node.lesson) {
      errors.push(`Node "${node.id}" missing lesson content`);
      continue;
    }

    nodesWithLessons++;

    if (node.lesson.tutorial && node.lesson.tutorial.length > 0) {
      nodesWithTutorial++;
    } else {
      errors.push(`Node "${node.id}" missing tutorial`);
    }

    if (node.lesson.workedExample && node.lesson.workedExample.problem && node.lesson.workedExample.solution) {
      nodesWithWorkedExample++;
    } else {
      errors.push(`Node "${node.id}" missing worked example`);
    }

    const ppCount = node.lesson.practiceProblems?.length || 0;
    totalPractice += ppCount;
    if (ppCount < minPractice) minPractice = ppCount;

    if (ppCount >= 2) {
      nodesWithPracticeProblems++;
    } else {
      errors.push(`Node "${node.id}" has only ${ppCount} practice problems (need ≥2)`);
    }

    // Check each practice problem
    for (let i = 0; i < ppCount; i++) {
      const p = node.lesson.practiceProblems[i];
      if (!p.options || p.options.length !== 4) {
        errors.push(`Node "${node.id}" practice problem ${i} doesn't have 4 options (has ${p.options?.length})`);
      }
      if (p.correctIndex < 0 || p.correctIndex >= 4) {
        errors.push(`Node "${node.id}" practice problem ${i} has invalid correctIndex ${p.correctIndex}`);
      }
      if (!p.explanation || p.explanation.length === 0) {
        errors.push(`Node "${node.id}" practice problem ${i} missing explanation`);
      }
      if (!p.expectedSeconds || p.expectedSeconds <= 0) {
        errors.push(`Node "${node.id}" practice problem ${i} missing expectedSeconds`);
      }
    }
  }

  // 6. Check problem bank
  const bankMap = new Map(problemBank.map(e => [e.nodeId, e]));
  let totalBankProblems = 0;
  let minBankPerNode = Infinity;

  for (const node of graph) {
    const entry = bankMap.get(node.id);
    if (!entry) {
      errors.push(`Problem bank missing entry for node "${node.id}"`);
      minBankPerNode = 0;
    } else {
      totalBankProblems += entry.problems.length;
      if (entry.problems.length < minBankPerNode) {
        minBankPerNode = entry.problems.length;
      }
      if (entry.problems.length < 2) {
        errors.push(`Problem bank for "${node.id}" has only ${entry.problems.length} problems (need ≥2)`);
      }

      for (let i = 0; i < entry.problems.length; i++) {
        const p = entry.problems[i];
        if (!p.options || p.options.length !== 4) {
          errors.push(`Problem bank "${node.id}" problem ${i} doesn't have 4 options`);
        }
        if (p.correctIndex < 0 || p.correctIndex >= 4) {
          errors.push(`Problem bank "${node.id}" problem ${i} has invalid correctIndex`);
        }
      }
    }
  }

  // 7. Check multistep scenarios
  for (const ms of multisteps) {
    if (!ms.steps || ms.steps.length < 8) {
      errors.push(`Multistep "${ms.id}" has only ${ms.steps?.length || 0} steps (need ≥8)`);
    }
    if (ms.steps && ms.steps.length > 12) {
      warnings.push(`Multistep "${ms.id}" has ${ms.steps.length} steps (expected 8-12)`);
    }

    for (const prereq of ms.prereqNodeIds) {
      if (!idSet.has(prereq)) {
        errors.push(`Multistep "${ms.id}" has unknown prereq "${prereq}"`);
      }
    }

    for (let i = 0; i < (ms.steps?.length || 0); i++) {
      const step = ms.steps[i];
      if (!step.options || step.options.length !== 4) {
        errors.push(`Multistep "${ms.id}" step ${i} doesn't have 4 options`);
      }
      if (step.correctIndex < 0 || step.correctIndex >= 4) {
        errors.push(`Multistep "${ms.id}" step ${i} has invalid correctIndex`);
      }
    }
  }

  // 8. Theme coverage
  const themeCoverage: Record<string, number> = {};
  for (const node of graph) {
    if (node.themes) {
      for (const t of node.themes) {
        themeCoverage[t] = (themeCoverage[t] || 0) + 1;
      }
    }
  }

  const totalEdges = graph.reduce((sum, n) => sum + n.prereqs.length, 0);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalNodes: graph.length,
      nodesWithLessons,
      nodesWithTutorial,
      nodesWithWorkedExample,
      nodesWithPracticeProblems,
      minPracticeProblems: minPractice === Infinity ? 0 : minPractice,
      avgPracticeProblems: graph.length > 0 ? totalPractice / graph.length : 0,
      totalProblemBankProblems: totalBankProblems,
      minBankProblemsPerNode: minBankPerNode === Infinity ? 0 : minBankPerNode,
      totalMultisteps: multisteps.length,
      avgStepsPerMultistep: multisteps.length > 0 ? multisteps.reduce((s, m) => s + (m.steps?.length || 0), 0) / multisteps.length : 0,
      orphanNodes: orphanNodes.length,
      totalEdges,
      themeCoverage,
    },
  };
}
