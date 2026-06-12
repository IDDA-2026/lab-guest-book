# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

The form was using the browser's default submit behavior. A normal HTML form tries
to submit/navigate when the submit button is clicked, so the page reloads and the
React state in the inputs disappears.

**What did I ask the AI / what did I look up:**

I reviewed how the submit event works in React forms and why `preventDefault()` is
used when JavaScript handles the submit manually.

**What was the solution:**

I added `e.preventDefault()` at the start of `handleSubmit`. That tells the
browser not to do its built-in form navigation because the React handler will send
the request instead.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

The original `fetch("/api/messages")` was only making a GET request. It did not
send a request body, so the server never received the `name` and `text` that its
POST handler expects from `await request.json()`.

**What did I ask the AI / what did I look up:**

I checked the route handler contract in `app/api/messages/route.js`: GET returns
messages, while POST reads JSON and creates a message. I also checked what a JSON
POST needs: method, headers, and body.

**What was the solution:**

I rebuilt the fetch call as a real POST:

- `method: "POST"`
- `headers: { "Content-Type": "application/json" }`
- `body: JSON.stringify({ name: trimmedName, text: trimmedText })`

After the server returns the created message, I append that returned message into
React state so it appears immediately without a manual refresh. Then I clear the
name and message inputs only after a successful save.

---

## Closing reflection

A `<form>` reloads by default because forms existed before JavaScript apps. Their
native job is to collect field values and navigate/send them to a URL.
`preventDefault()` stops that native navigation so the React submit handler can
control the request.

A GET is for asking the server for data. It is not the right request for saving a
new guestbook entry, and the broken request did not carry the name/message body.
A POST is the correct request because it sends data to the server to create
something new.

`Content-Type: application/json` tells the server that the body is JSON. The route
handler uses `request.json()`, so the client must send JSON. Without the correct
JSON body, the server has nothing useful to parse and save.

---

**Live URL (Vercel):** _not deployed_
