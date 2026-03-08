/**
 * Stage 2: Generate prerequisite edges.
 * Links characters to their radicals, words to their characters, and grammar to characters.
 */

import type { RawNode } from "./stage1-import";
import { getCached, setCache } from "./cache";

export interface NodeWithPrereqs extends RawNode {
  prereqs: string[];
}

export function generatePrereqs(rawNodes: RawNode[]): NodeWithPrereqs[] {
  const cacheKey = `prereqs-v3-${rawNodes.length}`;
  const cached = getCached<NodeWithPrereqs[]>("stage2", cacheKey);
  if (cached) {
    console.log(`  [cache hit] ${cached.length} nodes with prereqs loaded`);
    return cached;
  }

  const idSet = new Set(rawNodes.map(n => n.id));
  const hanziToCharId = new Map<string, string>();

  for (const n of rawNodes) {
    if (n.type === "character") {
      hanziToCharId.set(n.hanzi, n.id);
    }
  }

  const result: NodeWithPrereqs[] = rawNodes.map(node => {
    const prereqs: string[] = [];

    if (node.type === "radical") {
      // Radicals have no prereqs
    } else if (node.type === "character") {
      if (node.radicalIds) {
        for (const rid of node.radicalIds) {
          if (idSet.has(rid)) {
            prereqs.push(rid);
          }
        }
      }
    } else if (node.type === "word") {
      const chars = [...node.hanzi];
      for (const ch of chars) {
        const charId = hanziToCharId.get(ch);
        if (charId && idSet.has(charId)) {
          prereqs.push(charId);
        }
      }
      if (prereqs.length === 0 && node.radicalIds) {
        for (const cid of node.radicalIds) {
          if (idSet.has(cid)) {
            prereqs.push(cid);
          }
        }
      }
    } else if (node.type === "grammar") {
      if (node.radicalIds) {
        for (const cid of node.radicalIds) {
          if (idSet.has(cid)) {
            prereqs.push(cid);
          }
        }
      }
      // Grammar patterns at HSK 2+ depend on the HSK 1 patterns
      if (node.hskLevel && node.hskLevel >= 2) {
        const lowerLevelGrammar = rawNodes.filter(
          n => n.type === "grammar" && n.hskLevel && n.hskLevel < node.hskLevel!
        );
        if (lowerLevelGrammar.length > 0) {
          const sample = lowerLevelGrammar.slice(0, 2);
          for (const g of sample) {
            if (!prereqs.includes(g.id)) {
              prereqs.push(g.id);
            }
          }
        }
      }
    }

    return { ...node, prereqs: [...new Set(prereqs)] };
  });

  const totalEdges = result.reduce((sum, n) => sum + n.prereqs.length, 0);
  console.log(`  Generated ${totalEdges} prerequisite edges`);
  console.log(`  Orphan nodes (no prereqs, non-radical): ${result.filter(n => n.prereqs.length === 0 && n.type !== "radical").length}`);

  setCache("stage2", cacheKey, result);
  return result;
}
