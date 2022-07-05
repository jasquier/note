// Display help
export function usage(): void {
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
}
