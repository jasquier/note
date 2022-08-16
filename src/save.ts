import { Database, RunResult } from "sqlite3";
import debug from "debug";

const log = debug("save");

// Save a note with the given topic to the database
export async function saveNote(
  db: Database,
  topic: string,
  note: string
): Promise<void> {
  const topicId = await getTopicId(db, topic);
  const noteId = await insertNote(db, note);
  await linkNoteToTopic(db, noteId, topicId);
}

// Returns the id of a topic, creates the topic if it does not exist
async function getTopicId(db: Database, name: string): Promise<number> {
  let topicId = await selectTopic(db, name);
  if (!topicId) {
    topicId = await insertTopic(db, name);
  }
  return topicId;
}

// Creates a note with the given name, returns the created note's id
function insertNote(db: Database, name: string): Promise<number> {
  return insert(db, "INSERT INTO notes (content) VALUES (?)", name);
}

// Creates a link between a note and a topic
function linkNoteToTopic(
  db: Database,
  noteId: number,
  topicId: number
): Promise<number> {
  return insert(
    db,
    "INSERT INTO notes_topics (note_id, topic_id) VALUES (?, ?)",
    noteId,
    topicId
  );
}

// Looks up a topic and returns its id if the topic exists, otherwise returns undefined
function selectTopic(db: Database, name: string): Promise<number | undefined> {
  return selectRowId(db, "SELECT * FROM topics WHERE name = ?", name);
}

// Creates a topic with the given name, returns the created topic's id
function insertTopic(db: Database, name: string): Promise<number> {
  return insert(db, "INSERT INTO topics (name) VALUES (?)", name);
}

// Runs the given select sql statement and returns the id of the resulting row
function selectRowId(
  db: Database,
  sql: string,
  ...values: string[]
): Promise<number | undefined> {
  log(`selectRowId(): sql - ${sql}, values - ${values}`);

  return new Promise((resolve, reject) => {
    function cb(err: Error | null, row: Row) {
      if (err) reject(err);
      resolve(row?.id);
    }

    db.get(sql, ...values, cb);
  });
}

// Runs the given insert sql statement and returns the id of the created row
function insert(
  db: Database,
  sql: InsertStatement,
  ...values: string[] | number[]
): Promise<number> {
  log(`insert(): sql - ${sql}, values - ${values}`);

  return new Promise((resolve, reject) => {
    function cb(this: RunResult, err: Error) {
      if (err) reject(err);
      resolve(this.lastID);
    }

    db.run(sql, ...values, cb);
  });
}

interface Row {
  id: number;
}

type InsertStatement = `INSERT INTO ${string} (${string}) VALUES (${string})`;
