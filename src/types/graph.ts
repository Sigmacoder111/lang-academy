export type NodeType = "radical" | "character" | "word";

export interface GraphNode {
  id: string;
  type: NodeType;
  hanzi: string;
  pinyin: string;
  meaning: string;
  prereqs: string[];
}
