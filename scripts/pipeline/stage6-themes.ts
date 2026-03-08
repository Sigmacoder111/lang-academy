/**
 * Stage 6: Add AP theme tags to each node.
 * Maps vocabulary to the six College Board AP Chinese themes.
 */

import type { NodeWithLesson } from "./stage3-lessons";
import { AP_THEMES } from "./hsk-data";
import { getCached, setCache } from "./cache";

export interface NodeWithThemes extends NodeWithLesson {
  themes: string[];
}

function matchThemes(node: NodeWithLesson): string[] {
  const matched: string[] = [];
  const searchText = `${node.meaning} ${node.hanzi} ${node.pinyin}`.toLowerCase();

  for (const theme of AP_THEMES) {
    for (const keyword of theme.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        matched.push(theme.id);
        break;
      }
    }
  }

  if (matched.length === 0) {
    if (node.type === "radical" || node.type === "character") {
      const meaningLower = node.meaning.toLowerCase();
      if (/water|river|mountain|tree|rain|wind|sun|fire|earth|stone|grass/.test(meaningLower)) {
        matched.push("global_challenges");
      } else if (/person|woman|child|man|father|mother|heart/.test(meaningLower)) {
        matched.push("families_communities");
      } else if (/speak|write|read|word|book|pen/.test(meaningLower)) {
        matched.push("personal_public_identities");
      } else if (/color|beauty|art|music|sound|song|dance/.test(meaningLower)) {
        matched.push("beauty_aesthetics");
      } else if (/car|machine|phone|metal|tool/.test(meaningLower)) {
        matched.push("science_technology");
      } else {
        matched.push("contemporary_life");
      }
    } else if (node.type === "grammar") {
      matched.push("contemporary_life");
    } else {
      matched.push("contemporary_life");
    }
  }

  return [...new Set(matched)];
}

export function addAPThemes(nodes: NodeWithLesson[]): NodeWithThemes[] {
  const cacheKey = `themes-v3-${nodes.length}`;
  const cached = getCached<NodeWithThemes[]>("stage6", cacheKey);
  if (cached) {
    console.log(`  [cache hit] ${cached.length} themed nodes loaded`);
    return cached;
  }

  const result: NodeWithThemes[] = nodes.map(node => ({
    ...node,
    themes: matchThemes(node),
  }));

  const themeCounts: Record<string, number> = {};
  for (const node of result) {
    for (const t of node.themes) {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    }
  }

  console.log("  AP Theme distribution:");
  for (const theme of AP_THEMES) {
    console.log(`    ${theme.name}: ${themeCounts[theme.id] || 0} nodes`);
  }

  setCache("stage6", cacheKey, result);
  return result;
}
