"use client";

import { useEffect, useRef, useState } from "react";
import { createMessage, fetchMessages } from "@/lib/messagesApi";

export function useGuestbook() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const latestMessageRef = useRef(null);

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch((err) => console.error("Error:", err.message));
  }, []);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length]);

  async function signGuestbook(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      name: trimmedName,
      text: trimmedText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setName("");
    setText("");

    try {
      const savedMessage = await createMessage({
        name: trimmedName,
        text: trimmedText,
      });
      setMessages((prev) =>
        prev.map((message) => (message.id === tempId ? savedMessage : message))
      );
    } catch (err) {
      console.error("Error:", err.message);
      setMessages((prev) => prev.filter((message) => message.id !== tempId));
      setName(trimmedName);
      setText(trimmedText);
    }
  }

  const canSubmit = name.trim().length > 0 && text.trim().length > 0;

  return {
    name,
    setName,
    text,
    setText,
    messages,
    latestMessageRef,
    signGuestbook,
    canSubmit,
  };
}
