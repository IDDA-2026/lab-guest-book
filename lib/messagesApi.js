export async function fetchMessages() {
  const response = await fetch("/api/messages");
  if (!response.ok) {
    throw new Error("Server responded with " + response.status);
  }
  return response.json();
}

export async function createMessage({ name, text }) {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, text }),
  });

  if (!response.ok) {
    throw new Error("Server responded with " + response.status);
  }

  return response.json();
}
