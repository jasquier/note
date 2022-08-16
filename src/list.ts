import { Database } from "sqlite3";
import debug from "debug";
import chalk from "chalk";
import { SelectStatement, NoteSummary, Topic } from "./types.js";

const log = debug("list");

// List all notes or if provided a topic then list only notes under that topic
export async function listNotes(db: Database, topic?: string): Promise<void> {
  const notes = await selectRows<NoteSummary>(
    db,
    `SELECT
      notes.id AS noteId,
      notes.content AS content,
      notes.timestamp AS noteTimestamp,
      topics.id AS topicId,
      topics.name AS topic,
      topics.timestamp as topicTimestamp
    FROM notes
    JOIN notes_topics
      ON notes.id=notes_topics.note_id
    JOIN topics
      ON topics.id=notes_topics.topic_id
    ORDER BY notes.timestamp`
  );

  const topics = await selectTopics(db);

  log("listNotes(): notes ", notes);
  log("listNotes(): topics ", topics);

  printNotes(notes, topics, topic);
}

// Transform and then print notes, topic by topic, in note order
// TODO add a verbose option which includes more information like timestamps
function printNotes(
  notes: NoteSummary[],
  topics: Topic[],
  topic: string | undefined
): void {
  console.log();
  topics
    .map((t) => t.topic)
    .filter((t) => {
      if (topic) return t === topic;
      return t;
    })
    .forEach((t) => {
      console.log(`    ${chalk.green(t)}`);
      notes
        .filter((note) => note.topic === t)
        .sort(
          (a: NoteSummary, b: NoteSummary): number =>
            Date.parse(a.noteTimestamp) - Date.parse(b.noteTimestamp)
        )
        .forEach((note) => {
          console.log(`        - ${note.content}`);
        });
    });
}

// List all topics or delegate to listing notes under a topic
export async function listTopics(
  db: Database,
  topic: string | boolean
): Promise<void> {
  if (typeof topic === "boolean") {
    const topics = await selectTopics(db);
    printTopics(topics);
    return;
  }

  await listNotes(db, topic);
}

// Transform and then print topics
function printTopics(topics: Topic[]) {
  console.log();
  topics
    .map((t) => t.topic)
    .forEach((t) => {
      console.log(`    - ${chalk.green(t)}`);
    });
}

// Select all distinct topics in order by note creation
async function selectTopics(db: Database): Promise<Topic[]> {
  return await selectRows<Topic>(
    db,
    `SELECT
    DISTINCT
      topics.name as topic
    FROM notes
    JOIN notes_topics
      ON notes.id=notes_topics.note_id
    JOIN topics
      ON topics.id=notes_topics.topic_id
    ORDER BY notes.timestamp`
  );
}

// Runs the given select sql statement and returns the resulting rows
function selectRows<ResultType>(
  db: Database,
  sql: SelectStatement
): Promise<ResultType[]> {
  log(`selectRows(): sql - ${sql}`);

  return new Promise((resolve, reject) => {
    db.all(sql, (err: Error | null, rows: ResultType[]) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}
