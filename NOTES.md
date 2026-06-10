# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

The form is doing its normal browser behavior. Since the submit handler does not
stop the default submit, the browser tries to navigate/reload after Sign is
clicked. That refresh throws away the React state in the inputs before anything
useful can happen.

**What did I ask the AI / what did I look up:**

I asked the AI to complete the README tasks and checked the local Next.js Route
Handlers docs in `node_modules/next/dist/docs/`. The important reminder was that
the API route is a normal HTTP endpoint, so the client code has to take over the
form submit instead of letting the browser navigate.

**What was the solution:**

I added `e.preventDefault()` at the start of `handleSubmit`. That tells the
browser not to run the form's default navigation/reload behavior because the
React submit handler is going to send the request with JavaScript.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

The form was calling `fetch("/api/messages")` with no options, so it was a GET
request with no request body. The route handler's `POST` function expects JSON
from `await request.json()`, which means the old request had the wrong method
and gave the server no `name` or `text` to save.

**What did I ask the AI / what did I look up:**

I read `app/api/messages/route.js` and the Route Handlers guide. The docs show
that route handlers export functions for HTTP methods like `GET` and `POST`,
and that a POST handler can read the request body with `request.json()`.

**What was the solution:**

I rebuilt the fetch call with `method: "POST"`, a
`Content-Type: application/json` header, and
`body: JSON.stringify({ name: trimmedName, text: trimmedText })`. After a
successful response, I read the created message with `response.json()`, appended
it to `messages`, and then cleared the inputs.

---

## Closing reflection

- A `<form>` reloads because native forms were built to submit fields to a URL
  and navigate the browser to the response. `preventDefault()` prevents that
  native submit navigation so React can keep the page alive and handle the
  request itself.
- GET is for asking for data. It does not send the guestbook message as a JSON
  body for this route to read. POST is the right method when the client is
  sending data that should be created or saved.
- `Content-Type: application/json` tells the server that the request body is
  JSON. Without a JSON body matching that header, `request.json()` would not get
  the `name` and `text` values the route handler needs.

---

**Live URL (Vercel):** _paste here_
