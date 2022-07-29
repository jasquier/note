import sqlite3, { Database } from "sqlite3";
import fs from "fs/promises";
import path from "path";
import { saveNote } from "./save";

let db: Database;

beforeAll(async () => {
  // Create and initialize the db schema
  db = new sqlite3.Database(":memory:");
  const migrationFiles: string[] = await fs.readdir("./migrations");
  const cwd = process.cwd();
  for (const file of migrationFiles) {
    const filePath = path.resolve(cwd, "migrations", file);
    const migrations = await fs.readFile(filePath, "utf-8");
    const migrationStatements = migrations.split("\n\n");
    for (const statement of migrationStatements) {
      await exec(statement);
    }
  }
  // const tables = await run("SELECT name from sqlite_master");
  // console.log(tables);
});

beforeEach(async () => {
  // clear the db
  await exec("DELETE FROM notes_topics");
  await exec("DELETE FROM notes");
  await exec("DELETE FROM topics");
});

afterAll(() => {
  db.close();
});

describe("saving a note", () => {
  test("saves a note under a given topic", async () => {
    await saveNote(db, "general", "a general note");

    const [topic] = await run<Topic>("SELECT id, name FROM topics");
    const [note] = await run<Note>("SELECT id, content FROM notes");
    const [link] = await run<Link>(
      "SELECT note_id, topic_id FROM notes_topics"
    );

    expect(topic.name).toBe("general");
    expect(note.content).toBe("a general note");
    expect(link.note_id).toBe(note.id);
    expect(link.topic_id).toBe(topic.id);
  });
});

// Execute the given sql string
function exec(sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err: Error | null) => {
      if (err) reject(err);
      resolve();
    });
  });
}

// Run the given sql string and return all the results
function run<ResultType>(sql: string): Promise<ResultType[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err: Error, rows: ResultType[]) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

interface Topic {
  id: number;
  name: string;
  timestamp: string;
}

interface Note {
  id: number;
  content: string;
  timestamp: string;
}

interface Link {
  note_id: number;
  topic_id: number;
}
