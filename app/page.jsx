"use client";

import GuestbookForm from "@/components/GuestbookForm";
import MessageList from "@/components/MessageList";
import { useGuestbook } from "@/hooks/useGuestbook";

export default function Guestbook() {
  const {
    name,
    setName,
    text,
    setText,
    messages,
    latestMessageRef,
    signGuestbook,
    canSubmit,
  } = useGuestbook();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Guestbook</h1>
        <p className="text-zinc-500">
          Sign it, and your message should stick around for the next visitor.
        </p>
      </header>

      <GuestbookForm
        name={name}
        text={text}
        canSubmit={canSubmit}
        onNameChange={setName}
        onTextChange={setText}
        onSubmit={signGuestbook}
      />

      <MessageList messages={messages} latestMessageRef={latestMessageRef} />
    </main>
  );
}
