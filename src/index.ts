#! /usr/bin/env node

import minimist from "minimist";
import { Database } from "sqlite3";
import { usage } from "./usage";
import { connectDb } from "./connectDb";
import { listNotes, listTopics } from "./list";
import { saveNote } from "./save.js";

const argv = minimist(process.argv.slice(2));

// Check for invalid usage or if the user asked for help
if (process.argv.length === 2 || argv.help === true) {
  usage();
  process.exit();
}

const db: Database = connectDb();

async function topics() {
  await listTopics(db, argv.t);
  process.exit();
}

async function notes() {
  await listNotes(db);
  process.exit();
}

async function save() {
  await saveNote(db, argv.t, argv._[0]);
}

if (argv.list === true) {
  // Output notes or notes under a topic
  if (argv.t) {
    topics();
  } else {
    notes();
  }
} else {
  // Set the default topic if none is given
  if (argv._.length === 1 && !argv.t) {
    argv.t = "general";
  }

  // At this point we have a note and a topic
  save();
}
