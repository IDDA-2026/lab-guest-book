"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Relative-time helper  –  turns a Date/ISO-string into "just now", "2m ago"…
// ---------------------------------------------------------------------------
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Guestbook() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  // Ref used to scroll the latest signature into view.
  const listEndRef = useRef(null);

  // Re-render every 30 s so the relative timestamps stay fresh.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Load the existing messages when the page first appears.
  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  // Smoothly scroll the bottom-of-list marker into view.
  function scrollToLatest() {
    // Small timeout so the DOM has a chance to paint the new <li> first.
    setTimeout(() => {
      listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  async function handleSubmit(e) {
    // 1. Stop the browser's default form-submit behaviour (page reload).
    e.preventDefault();

    // Guard: never fire a request with blank fields.
    if (!name.trim() || !text.trim()) return;

    const trimmedName = name.trim();
    const trimmedText = text.trim();

    // --- Optimistic update ---------------------------------------------------
    // Show the message instantly so the UX feels snappy, then reconcile once the
    // server responds. If the POST fails we roll back.
    const tempId = `optimistic-${Date.now()}`;
    const optimistic = {
      id: tempId,
      name: trimmedName,
      text: trimmedText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setName("");
    setText("");
    scrollToLatest();

    // 2. Send a real POST with a JSON body so the server can save the message.
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, text: trimmedText }),
      });

      if (res.ok) {
        // Reconcile: swap the optimistic placeholder for the real server record.
        const saved = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...saved, createdAt: optimistic.createdAt } : m
          )
        );
      } else {
        // Server rejected (400, 500…) → roll back.
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch {
      // Network error → roll back.
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
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
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium">{message.name}</p>
                  {message.createdAt && (
                    <span className="shrink-0 text-xs text-zinc-400">
                      {timeAgo(message.createdAt)}
                    </span>
                  )}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {message.text}
                </p>
              </li>
            ))}
            {/* Invisible marker so we can scroll new signatures into view. */}
            <li ref={listEndRef} className="h-0" aria-hidden="true" />
          </ul>
        )}
      </section>
    </main>
  );
}
