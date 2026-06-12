# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

The `<form>` element has default browser behavior — when you hit submit, the browser
packages up the fields and navigates to the form's `action` URL (or reloads the
current page when there is no `action`). That navigation destroys the React tree
and all component state, which is why the inputs reset and the message list goes
back to the initial server render.

**What did I ask the AI / what did I look up:**

MDN — `HTMLFormElement: submit event`. The key part: calling `e.preventDefault()`
inside the `onSubmit` handler stops the browser from doing its built-in navigate.
After that, the page stays put and React stays mounted so I can handle everything
in JavaScript.

**What was the solution:**

Added `e.preventDefault()` as the first line of `handleSubmit(e)`. One line, but
it flips control from the browser's native form behavior to my own JavaScript
handler.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

The original code called `fetch("/api/messages")` with zero options — that is a
plain GET request. No method override, no headers, no body. The route handler's
`POST` function never even fires for a GET; it just returns the existing array.
Even if the POST *did* fire, the server's first line is `await request.json()`,
so it needs a JSON body — the old fetch sends nothing.

**What did I ask the AI / what did I look up:**

MDN — `fetch()` with a JSON body. Three things had to be present for the route
handler to work:
1. `method: "POST"` — so the server's POST handler is invoked.
2. `headers: { "Content-Type": "application/json" }` — so the server knows the
   body is JSON.
3. `body: JSON.stringify({ name, text })` — the actual data the server will parse
   and store.

**What was the solution:**

Rebuilt the fetch call with all three pieces:

```js
const res = await fetch("/api/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: trimmedName, text: trimmedText }),
});
```

Then used the server's response to update the UI. I went with an **optimistic
update** — the message shows up instantly before the server responds, and gets
reconciled (or rolled back) once the response arrives.

---

## Closing reflection

- **Why does a `<form>` reload the page by default, and what does `preventDefault`
  actually prevent?**

  Forms were invented before JavaScript existed. Their native job is to serialize
  the fields, fire an HTTP request to the `action` URL, and navigate the browser
  to whatever the server sends back. `preventDefault()` stops that entire chain —
  it prevents the *default action* of the submit event, which is the navigation.
  After calling it, nothing happens unless you explicitly write the code yourself.

- **Why can a GET not carry your message, while a POST can?**

  By HTTP spec, GET is for *retrieving* a resource — the server reads the URL and
  query string, but GET has no request body. POST is for *submitting* data — it
  carries a body. The route handler calls `request.json()`, which reads the body.
  A GET simply does not have one, so there is nothing for the server to parse.

- **Why is the `Content-Type` header important, and what breaks without it?**

  `Content-Type: application/json` tells the server "the bytes in this body are
  JSON — parse them accordingly." Without it, the server cannot know the encoding
  format. `request.json()` depends on this header to correctly decode the body;
  without it the parse would fail and the message would never be saved.

---

## Bonus features implemented

- **Optimistic UI**: new messages appear instantly before the server responds;
  reconciled or rolled back depending on the response.
- **Empty-field guard**: the client silently skips submit when name or message is
  blank, so the server never receives a 400-worthy request.
- **Relative timestamps**: each new signature shows "just now", then updates to
  "30s ago", "2m ago", etc. every 30 seconds.
- **Auto-scroll**: new signatures smoothly scroll into view so the latest entry is
  always visible.

---

**Live URL (Vercel):** https://lab-guest-book-two.vercel.app/
