# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

The `<form>` element has built-in default behavior: when you submit it, the browser treats it like a traditional form (pre-JavaScript era) and attempts to navigate to the form's action URL. Since no action was specified, it defaults to the current page, causing a full page reload. This refresh clears the React state—the `name`, `text`, and `messages` state variables are reset, so the input boxes empty and any unsaved message disappears.

**What did I ask the AI / what did I look up:**

I read the `handleSubmit` function and immediately recognized that it was missing `e.preventDefault()`. The MDN docs on form submission confirm that forms fire a `submit` event, and calling `preventDefault()` on that event stops the browser's default navigation behavior, keeping control in JavaScript.

**What was the solution:**

Added `e.preventDefault()` as the first line in the `handleSubmit` function. This single line tells the browser "I have this handled, do not do your default navigation." The page now stays put, the React state persists, and the component remains interactive.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

The broken fetch was `await fetch("/api/messages")` with no options. This defaults to a GET request with no body. Looking at the route handler, it calls `await request.json()` on the first line of the POST function, expecting a JSON body containing `{ name, text }`. But a GET request carries no body, so the server has nothing to parse—it never receives the name or message, so nothing gets saved.

**What did I ask the AI / what did I look up:**

I read the route handler's POST function carefully. It immediately calls `request.json()`, which tells me the server expects the client to send a JSON body. The MDN `fetch` API docs show that to send data, you need:
- `method: "POST"` (the verb that means "here is data to store")
- `headers: { "Content-Type": "application/json" }` (to tell the server what format the body is)
- `body: JSON.stringify(...)` (the actual JSON data)

**What was the solution:**

Rebuilt the fetch call to be a proper POST:
```javascript
const response = await fetch("/api/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, text }),
});
```

This sends the form data as JSON. The server parses it, validates it, creates a new message object with an id, pushes it to the array, and returns it with status 201. The client then appends the returned message to the `messages` state so it appears instantly in the list.

---

## Closing reflection

**Why does a `<form>` reload the page by default, and what does `preventDefault` actually prevent?**

Forms predate JavaScript. Their original job was to collect inputs and submit them to a server URL, with the browser handling the navigation. The browser's default behavior is to construct a form submission and navigate to the target URL—this causes a page reload. `preventDefault()` stops that navigation. You are telling the browser "I will handle sending this data myself via JavaScript," which lets you use fetch to send the data without losing your component state.

**Why can a GET not carry your message, while a POST can?**

HTTP verbs have semantic meaning. GET is for *requesting* data from the server—it has no body by spec. POST is for *sending* data to the server to be stored or processed. The body of a POST request is exactly where the client puts the data. The server's `request.json()` call expects that body to exist and be valid JSON.

**What is the `Content-Type` header telling the server, and what breaks without it?**

The `Content-Type` header tells the server what format the body is in. Without it, the server cannot know whether the bytes are JSON, form-encoded data, plain text, binary, etc. The route handler calls `request.json()`, which specifically expects `Content-Type: application/json`. Without that header, the server might try to parse the body as a different format, or `request.json()` might fail trying to parse something that was not marked as JSON.


---

**Live URL (Vercel):** _paste here_
