import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

// Display usage hints and exit
function usage(): void {
  console.log();
  console.log("    Getting Help:");
  console.log("        note --help                 display help");
  console.log("    Listing Information:");
  console.log("        note --list                 output all notes");
  console.log("        note --list -t              output all topics");
  console.log(
    "        note --list -t <topic>      output all notes under a topic"
  );
  console.log("    Adding Notes:");
  console.log(
    "        note '<note>'               create a note under the 'general' topic"
  );
  console.log(
    "        note -t <topic> '<note>'    create a note under the given topic"
  );

  process.exit();
}

// List all notes or if provided a topic list only notes under that topic
function listNotes(topic?: string) {
  if (topic) {
    console.log("\n    Coming Soon: Listing notes under a topic!");
    process.exit();
  }
  console.log("\n    Coming Soon: Listing notes!");

  process.exit();
}

// List all topics or delegate to listing notes under a topic
function listTopics(topic?: string | boolean) {
  if (typeof topic === "boolean") {
    console.log("\n    Coming soon: Listing all topics!");
    process.exit();
  }

  listNotes(topic);
}

function saveNote(topic: string, note: string) {
  console.log(`Your topic is ${topic} and your note is ${note}`);
  console.log("\n    Coming soon: Saving a note!");
}

// Check for invalid usage or if the user asked for help
if (process.argv.length === 2 || argv.help === true) {
  usage();
}

// Output notes or notes under a topic
if (argv.list === true) {
  if (argv.t) listTopics(argv.t);

  listNotes();
}

// Set the default topic if none is given
if (argv._.length === 1 && !argv.t) {
  argv.t = "general";
}

// At this point we have a note and a topic
saveNote(argv.t, argv._[0]);
