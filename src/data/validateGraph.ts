import type { GraphNode } from "../types/graph";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGraph(nodes: GraphNode[]): ValidationResult {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const node of nodes) {
    if (ids.has(node.id)) {
      errors.push(`Duplicate node ID: "${node.id}"`);
    }
    ids.add(node.id);
  }

  for (const node of nodes) {
    for (const prereq of node.prereqs) {
      if (!ids.has(prereq)) {
        errors.push(
          `Node "${node.id}" has unknown prereq "${prereq}"`
        );
      }
    }
  }

  // Cycle detection via topological sort (Kahn's algorithm)
  const adjCount = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const node of nodes) {
    adjCount.set(node.id, node.prereqs.filter((p) => ids.has(p)).length);
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

  if (visited !== nodes.length) {
    errors.push(
      `Graph contains circular dependencies (${nodes.length - visited} node(s) involved in cycles)`
    );
  }

  // Validate lesson content
  for (const node of nodes) {
    if (!node.lesson) {
      errors.push(`Node "${node.id}" missing lesson content`);
      continue;
    }
    if (!node.lesson.tutorial) {
      errors.push(`Node "${node.id}" missing tutorial`);
    }
    if (!node.lesson.workedExample?.problem || !node.lesson.workedExample?.solution) {
      errors.push(`Node "${node.id}" missing worked example`);
    }
    if (!node.lesson.practiceProblems || node.lesson.practiceProblems.length < 2) {
      errors.push(`Node "${node.id}" has fewer than 2 practice problems`);
    }
  }

  return { valid: errors.length === 0, errors };
}
