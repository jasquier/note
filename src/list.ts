import { Database } from "sqlite3";

// List all notes or if provided a topic then list only notes under that topic
export async function listNotes(db: Database, topic?: string): Promise<void> {
  console.log(topic);
  if (topic) {
    console.log("\n    Coming Soon: Listing notes under a topic!");
    return;
  }

  const notes = await selectRows(
    db,
    "SELECT notes.id AS noteId, notes.content AS content, notes.timestamp AS noteTimestamp, topics.id AS topicId, topics.name AS topic, topics.timestamp as topicTimestamp FROM notes JOIN notes_topics ON notes.id=notes_topics.note_id JOIN topics ON topics.id=notes_topics.topic_id"
  );

  // TODO figure out format for printing notes, probably group them under topics?
  console.log(notes);
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
function selectRows(
  db: Database,
  sql: string,
  ...values: string[]
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Promise<any[]> {
  console.log(`selectRows(): sql - ${sql}, values - ${values}`);

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function cb(err: Error, rows: any[]) {
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
