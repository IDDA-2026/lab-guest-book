import { formatRelativeTime } from "@/lib/formatRelativeTime";

export default function MessageList({ messages, latestMessageRef }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {messages.length} signature{messages.length === 1 ? "" : "s"}
      </h2>

      {messages.length === 0 ? (
        <p className="text-zinc-400">No one has signed yet…</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((message, index) => (
            <li
              key={message.id}
              ref={index === messages.length - 1 ? latestMessageRef : null}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-medium">{message.name}</p>
                {message.createdAt && (
                  <span className="shrink-0 text-xs text-zinc-400">
                    {formatRelativeTime(message.createdAt)}
                  </span>
                )}
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">{message.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
