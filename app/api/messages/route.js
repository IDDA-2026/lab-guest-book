import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "messages.json");

const SEED_MESSAGES = [
  {
    id: 1,
    name: "Ada",
    text: "First! Lovely little guestbook you have here.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: "Grace",
    text: "Signed it. Let's see if it remembers me…",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

// In-memory fallback for environments where the filesystem is read-only (e.g. Vercel).
let memoryStore = null;

async function readMessages() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    memoryStore = JSON.parse(raw);
    return memoryStore;
  } catch {
    if (memoryStore) return memoryStore;

    memoryStore = [...SEED_MESSAGES];
    await writeMessages(memoryStore);
    return memoryStore;
  }
}

async function writeMessages(messages) {
  memoryStore = messages;

  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch {
    // Local dev uses the JSON file; on Vercel we keep messages in memory only.
  }
}

export async function GET() {
  const messages = await readMessages();
  return Response.json(messages);
}

export async function POST(request) {
  const body = await request.json();
  const name = (body.name || "").trim();
  const text = (body.text || "").trim();

  if (!name || !text) {
    return Response.json(
      { error: "Both a name and a message are required." },
      { status: 400 }
    );
  }

  const newMessage = {
    id: Date.now(),
    name,
    text,
    createdAt: new Date().toISOString(),
  };

  const messages = await readMessages();
  messages.push(newMessage);
  await writeMessages(messages);

  return Response.json(newMessage, { status: 201 });
}
