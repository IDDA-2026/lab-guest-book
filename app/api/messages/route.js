// A tiny in-memory "database" for the guestbook.
// It lives in the server's memory, so it survives while the dev server is
// running and resets when you restart it. That is fine for this lab.
//
// This file is CORRECT. You do not need to change anything in here. Read it so
// you understand exactly what the server expects when you POST a new message.

let messages = [
  { id: 1, name: "Ada", text: "First! Lovely little guestbook you have here." },
  { id: 2, name: "Grace", text: "Signed it. Let's see if it remembers me…" },
];

export async function GET() {
  return Response.json(messages);
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
 const nextId = messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;
const newMessage = { id: nextId, name, text };
messages.push(newMessage);
return Response.json(newMessage, { status: 201 });
}
