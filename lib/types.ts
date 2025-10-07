export interface EmailBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
}

export interface BlockPosition {
  index: number;
  blockId: string;
}
