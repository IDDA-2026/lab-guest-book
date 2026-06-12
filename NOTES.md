# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

The form is using the browser's normal submit behavior. A plain HTML form tries
to navigate when it submits, so React state gets thrown away and the page flashes.

**What did I ask the AI / what did I look up:**

I read `app/page.js`, the route handler, and the local Next.js Route Handlers
guide in `node_modules/next/dist/docs/`. The important clue was that the page
handler is client-side React code, while `app/api/messages/route.js` is a real
HTTP endpoint.

**What was the solution:**

I added `e.preventDefault()` at the start of `handleSubmit`. That tells the
browser not to do its default form navigation because the React submit handler is
going to send the request itself.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

The old `fetch("/api/messages")` was just a GET request. It did not send the
name or message in a JSON body, so the `POST` handler's `await request.json()`
would never receive anything useful to save.

**What did I ask the AI / what did I look up:**

I compared the client fetch in `app/page.js` with the server contract in
`app/api/messages/route.js`. The route exports both `GET` and `POST`, and the
`POST` function reads JSON with `await request.json()`.

**What was the solution:**

I rebuilt the fetch call with `method: "POST"`, a `Content-Type:
application/json` header, and `body: JSON.stringify({ name, text })`. After a
successful response, I read the created message from the response and appended it
to `messages` state so it appears immediately.

---

## Closing reflection

_Answer in a few sentences each:_

- A `<form>` reloads because forms were originally built to submit fields to a
  URL and navigate there. `preventDefault()` stops that native navigation so the
  JavaScript handler can control the request.
- A GET is for asking for data and the original request had no message body.
  POST is the right method when the client is sending data that should be saved.
- `Content-Type: application/json` tells the server that the request body is JSON.
  Without a JSON body in the shape the route expects, `request.json()` has
  nothing useful to parse into `name` and `text`.

---

**Live URL (Vercel):** _paste here_
