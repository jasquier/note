// List all notes or if provided a topic list only notes under that topic
export function listNotes(topic?: string): void {
  if (topic) {
    console.log("\n    Coming Soon: Listing notes under a topic!");
    return;
  }

  console.log("\n    Coming Soon: Listing notes!");
}

// List all topics or delegate to listing notes under a topic
export function listTopics(topic: string | boolean): void {
  if (typeof topic === "boolean") {
    console.log("\n    Coming soon: Listing all topics!");
    return;
  }

  listNotes(topic);
}
