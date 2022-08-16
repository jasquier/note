export type SelectStatement = `SELECT${string}`;

export type InsertStatement =
  `INSERT INTO ${string} (${string}) VALUES (${string})`;

export interface Row {
  id: number;
}

export interface Topic {
  topic: string;
}

export interface NoteSummary {
  noteId: number;
  content: string;
  noteTimestamp: string;
  topicId: number;
  topic: string;
  topicTimestamp: string;
}
