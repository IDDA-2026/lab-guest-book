"use client";

import { useEffect, useState, useRef } from "react";

export default function Guestbook() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const listEndRef = useRef(null);

  // Load the existing messages when the page first appears.
  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedText = text.trim();

    if (!trimmedName || !trimmedText) {
      alert("Name and message are required!");
      return;
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName, text: trimmedText }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        setName("");
        setText("");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to sign guestbook.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
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
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className="rounded-md border border-zinc-300 px-3 py-2 text-base font-normal outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Your message
          <textarea
            required
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
                <div className="flex justify-between items-baseline gap-2 mb-1">
                  <p className="font-medium">{message.name}</p>
                  {message.id > 1000 && (
                    <span className="text-xs text-zinc-400 font-normal">
                      {new Date(message.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">{message.text}</p>
              </li>
            ))}
            <div ref={listEndRef} />
          </ul>
        )}
      </section>
    </main>
  );
}
