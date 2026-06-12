// A persistent "database" for the guestbook.
// Messages are stored in a JSON file on disk so they survive server restarts.
//
// On first run (or if the file is missing) the seed data is used automatically.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "messages.json");

const SEED = [
  { id: 1, name: "Ada", text: "First! Lovely little guestbook you have here." },
  { id: 2, name: "Grace", text: "Signed it. Let's see if it remembers me…" },
];

// Read all messages from disk (or return the seed data if no file exists yet).
function readMessages() {
  if (!existsSync(DATA_FILE)) return [...SEED];
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [...SEED];
  }
}

// Write the full messages array to disk as pretty-printed JSON.
function writeMessages(messages) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

export async function GET() {
  return Response.json(readMessages());
}

export async function POST(request) {
  // The server reads the body as JSON. That means the request that reaches it
  // has to actually CARRY a JSON body. (Hint, hint.)
  const body = await request.json();
  const name = (body.name || "").trim();
  const text = (body.text || "").trim();

  if (!name || !text) {
    return Response.json(
      { error: "Both a name and a message are required." },
      { status: 400 }
    );
  }

  const messages = readMessages();
  const newMessage = { id: Date.now(), name, text };
  messages.push(newMessage);
  writeMessages(messages);

  return Response.json(newMessage, { status: 201 });
}
