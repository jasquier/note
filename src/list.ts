import { Database } from "sqlite3";
import debug from "debug";
import chalk from "chalk";

const log = debug("list");

// List all notes or if provided a topic then list only notes under that topic
// TODO add a verbose option which includes more information like timestamps
export async function listNotes(db: Database, topic?: string): Promise<void> {
  const notes = await selectRows<Summary>(
    db,
    "SELECT notes.id AS noteId, notes.content AS content, notes.timestamp AS noteTimestamp, topics.id AS topicId, topics.name AS topic, topics.timestamp as topicTimestamp FROM notes JOIN notes_topics ON notes.id=notes_topics.note_id JOIN topics ON topics.id=notes_topics.topic_id ORDER BY notes.timestamp"
  );

  const topics = await selectRows<Topic>(
    db,
    "SELECT DISTINCT topics.name as topic FROM notes JOIN notes_topics ON notes.id=notes_topics.note_id JOIN topics ON topics.id=notes_topics.topic_id ORDER BY notes.timestamp"
  );

  log("listNotes(): notes ", notes);
  log("listNotes(): topics ", topics);

  function byNoteTimestamp(a: Summary, b: Summary): number {
    return Date.parse(a.noteTimestamp) - Date.parse(b.noteTimestamp);
  }

  // TODO extract this printing to its own function
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
        .sort(byNoteTimestamp)
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
    console.log("\n    Coming soon: Listing all topics!");
    return;
  }
  await listNotes(db, topic);
}

// Runs the given select sql statement and returns the resulting rows
function selectRows<ResultType>(
  db: Database,
  sql: SelectStatement,
  ...values: string[]
): Promise<ResultType[]> {
  log(`selectRows(): sql - ${sql}, values - ${values}`);

  return new Promise((resolve, reject) => {
    function cb(err: Error, rows: ResultType[]) {
      if (err) reject(err);
      resolve(rows);
    }

    if (values.length) {
      db.all(sql, ...values, cb);
    } else {
      db.all(sql, cb);
    }
  });
}

interface Summary {
  noteId: number;
  content: string;
  noteTimestamp: string;
  topicId: number;
  topic: string;
  topicTimestamp: string;
}

interface Topic {
  topic: string;
}

type SelectStatement = `SELECT ${string}`;
