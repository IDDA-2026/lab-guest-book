"use client";

import { useEffect, useRef, useState } from "react";

function relativeTime(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 5)   return "just now";
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(isoString).toLocaleDateString();
}

export default function Guestbook() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError]     = useState("");
  const bottomRef             = useRef(null);

  // Load the existing messages when the page first appears.
  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
 
    if (!name.trim() || !text.trim()) {
      setError("Both a name and a message are required.");
      return;
    }
 
    const optimisticId = `optimistic-${Date.now()}`;
    const optimistic = {
      id: optimisticId,
      name: name.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      pending: true,
    };
 
    setMessages((prev) => [...prev, optimistic]);
    setName("");
    setText("");
 
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
 
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: optimistic.name, text: optimistic.text }),
      });
 
      if (!res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setError("Something went wrong saving your message. Please try again.");
        return;
      }
 
      const saved = await res.json();
 
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? saved : m))
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setError("Network error — your message wasn't saved.");
    }
  }
return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Guestbook</h1>
        <p className="text-zinc-500">
          Sign it, and your message should stick around for the next visitor.
        </p>
      </header>
 
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Your name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className="rounded-md border border-zinc-300 px-3 py-2 text-base font-normal outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
          />
        </label>
 
        <label className="flex flex-col gap-1 text-sm font-medium">
          Your message
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Leave something nice…"
            rows={3}
            className="resize-none rounded-md border border-zinc-300 px-3 py-2 text-base font-normal outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
          />
        </label>
 
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
 
        <button
          type="submit"
          className="self-start rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Sign
        </button>
      </form>
 
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {messages.length} signature{messages.length === 1 ? "" : "s"}
        </h2>
 
        {messages.length === 0 ? (
          <p className="text-zinc-400">No one has signed yet…</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`rounded-lg border p-4 transition-opacity ${
                  message.pending
                    ? "border-zinc-200 bg-white opacity-60 dark:border-zinc-800 dark:bg-zinc-900"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium">{message.name}</p>
                  <time className="shrink-0 text-xs text-zinc-400">
                    {message.pending ? "saving…" : relativeTime(message.createdAt ?? message.id)}
                  </time>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">{message.text}</p>
              </li>
            ))}
          </ul>
        )
        }
        {/* Scroll target — sits just below the last message. */}
        <div ref={bottomRef} />
      </section>
    </main>
  );
}