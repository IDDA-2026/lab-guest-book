export default function GuestbookForm({
  name,
  text,
  canSubmit,
  onNameChange,
  onTextChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Your name
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ada Lovelace"
          className="rounded-md border border-zinc-300 px-3 py-2 text-base font-normal outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Your message
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Leave something nice…"
          rows={3}
          className="resize-none rounded-md border border-zinc-300 px-3 py-2 text-base font-normal outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
        />
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className="self-start rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Sign
      </button>
    </form>
  );
}
