# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**
The HTML `<form>` element has a built-in historical behavior. When a submit event is triggered (clicking "Sign"), the browser natively tries to package the inputs and navigate or submit to a URL, which forces a full page reload and completely wipes out our local React state.

**What did I ask the AI / what did I look up:**
I looked into how to stop native form submission in React. The documentation and AI guidance pointed out that we need to intercept the submission event right at the start of our handler function.

**What was the solution:**
The solution was adding `e.preventDefault();` as the very first line inside the `handleSubmit(e)` function. This explicitly tells the browser: "Stop your native navigation behavior, I will handle the form lifecycle using JavaScript."

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**
Even though the page sat still after fixing Bug 1, the network tab showed that the form was firing a default `GET` request to `/api/messages`. This request had no body payload and used the wrong HTTP verb, meaning the server was just returning the existing list rather than accepting new data.

**What did I ask the AI / what did I look up:**
I investigated how to convert a standard `fetch` call into a structured JSON POST request. I also noticed a curious behavior: the seeded messages had clean IDs like `1` and `2`, but my newly created messages had huge numbers like `1718112345678`. I looked into the backend file `app/api/messages/route.js` to see why this was happening and asked how to fix it to make the IDs sequential.

**What was the solution:**
I rebuilt the frontend `fetch` call with the correct `'POST'` method, added the `'Content-Type': 'application/json'` header, and passed `JSON.stringify({ name, text })` into the body. 

Furthermore, I went into the backend `route.js` file and discovered the server was using `id: Date.now()` (timestamp) for new entries. To fix this and make the IDs clean and sequential, I modified the backend logic to check the current array length and increment the ID based on the last message:
```javascript
const nextId = messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;
const newMessage = { id: nextId, name, text };

---

## Closing reflection

- **Why does a `<form>` reload the page by default, and what does `preventDefault` actually prevent?**
  Forms predate JavaScript and modern Single Page Applications (SPAs). Their original native job was to bundle inputs and navigate the browser to a new URL to process data. `preventDefault()` steps in to prevent this exact default browser navigation/reload cycle, keeping the user on the same page.

- **Why can a GET not carry your message, while a POST can?**
  An HTTP `GET` request is designed semantically to retrieve data from a server; it passes parameters openly via the URL query string and does not support a data payload body. A `POST` request is explicitly built to submit data to a server, providing a dedicated `body` stream capable of securely holding large blocks of data (like our JSON string).

- **What is the `Content-Type` header telling the server, and what breaks without it?**
  The `Content-Type` header acts as a universal road sign telling the server exactly how to decode the incoming raw bytes of data. Without `Content-Type: application/json`, the server cannot guess the data format, causing methods like `await request.json()` to crash or fail because it doesn't realize it should parse the request body as JSON.

---



**Live URL (Vercel):** https://lab-guest-book-five.vercel.app/
