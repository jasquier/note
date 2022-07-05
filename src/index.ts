import minimist from "minimist";
import { usage } from "./usage.js";
import { listNotes, listTopics } from "./listing.js";
import { saveNote } from "./saveNote.js";

const argv = minimist(process.argv.slice(2));

// Check for invalid usage or if the user asked for help
if (process.argv.length === 2 || argv.help === true) {
  usage();
  process.exit();
}

// Output notes or notes under a topic
if (argv.list === true) {
  if (argv.t) {
    listTopics(argv.t);
    process.exit();
  }

  listNotes();
  process.exit();
}

// Set the default topic if none is given
if (argv._.length === 1 && !argv.t) {
  argv.t = "general";
}

// At this point we have a note and a topic
saveNote(argv.t, argv._[0]);
