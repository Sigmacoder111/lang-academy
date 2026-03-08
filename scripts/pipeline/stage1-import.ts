/**
 * Stage 1: Import HSK vocabulary → raw graph nodes.
 * Converts radicals, characters, words, and grammar patterns into a flat node list.
 */

import type { NodeType } from "../../src/types/graph";
import { RADICALS, CHARACTERS, WORDS, GRAMMAR_PATTERNS } from "./hsk-data";
import { expandVocabulary } from "./expand-vocab";
import { getCached, setCache } from "./cache";

export interface RawNode {
  id: string;
  type: NodeType;
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel?: number;
  radicalIds?: string[];
}

function sanitizeId(prefix: string, hanzi: string): string {
  const hex = [...hanzi].map(c => c.codePointAt(0)!.toString(16)).join("");
  return `${prefix}_${hex}`;
}

export function importHSKVocabulary(): RawNode[] {
  const cached = getCached<RawNode[]>("stage1", "hsk-import-v3");
  if (cached) {
    console.log(`  [cache hit] ${cached.length} raw nodes loaded from cache`);
    return cached;
  }

  const nodes: RawNode[] = [];
  const seenIds = new Set<string>();

  function addNode(node: RawNode) {
    if (seenIds.has(node.id)) return;
    seenIds.add(node.id);
    nodes.push(node);
  }

  for (const r of RADICALS) {
    addNode({
      id: r.id,
      type: "radical",
      hanzi: r.hanzi,
      pinyin: r.pinyin,
      meaning: r.meaning,
    });
  }

  for (const c of CHARACTERS) {
    const id = sanitizeId("c", c.hanzi);
    addNode({
      id,
      type: "character",
      hanzi: c.hanzi,
      pinyin: c.pinyin,
      meaning: c.meaning,
      hskLevel: c.hskLevel,
      radicalIds: c.radicals,
    });
  }

  for (const w of WORDS) {
    const id = sanitizeId("w", w.hanzi);
    const chars = [...w.hanzi];
    const charIds = chars.map(ch => sanitizeId("c", ch));
    addNode({
      id,
      type: "word",
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      meaning: w.meaning,
      hskLevel: w.hskLevel,
      radicalIds: charIds,
    });
  }

  for (const g of GRAMMAR_PATTERNS) {
    addNode({
      id: g.id,
      type: "grammar",
      hanzi: g.pattern,
      pinyin: g.pinyin,
      meaning: g.meaning,
      hskLevel: g.hskLevel,
      radicalIds: g.prereqCharIds,
    });
  }

  // Expand vocabulary to reach 2,500+ nodes
  const expanded = expandVocabulary(nodes);

  setCache("stage1", "hsk-import-v3", expanded);
  console.log(`  Imported ${expanded.length} raw nodes`);
  console.log(`    - ${expanded.filter(n => n.type === "radical").length} radicals`);
  console.log(`    - ${expanded.filter(n => n.type === "character").length} characters`);
  console.log(`    - ${expanded.filter(n => n.type === "word").length} words`);
  console.log(`    - ${expanded.filter(n => n.type === "grammar").length} grammar patterns`);
  console.log(`    - ${expanded.filter(n => n.type === "reading").length} reading nodes`);
  console.log(`    - ${expanded.filter(n => n.type === "writing").length} writing nodes`);
  return expanded;
}
