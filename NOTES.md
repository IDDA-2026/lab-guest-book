# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

The form submit was using the browser's default submit behavior, so the page tried to navigate to the current URL and refresh itself. That is why the screen flashed and the typed text disappeared.

**What did I ask the AI / what did I look up:**

I checked the README lab instructions and the form handler in app/page.js. The README explains that the default form submit causes the reload and that the fix is to stop the browser's native behavior.

**What was the solution:**

I added e.preventDefault() at the start of the submit handler in app/page.js. That tells the browser to let the React code handle the submission instead of reloading the page.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

The submit handler was calling fetch("/api/messages") with no method or JSON body, so the browser was not sending the data the route handler expects. The API route reads request.json() and looks for name and text, which only works with a real JSON POST request.

**What did I ask the AI / what did I look up:**

I used the README guidance and the server route in app/api/messages/route.js. The route clearly expects a POST request with JSON data shaped like { name, text }.

**What was the solution:**

I changed the fetch call to use method: "POST", set Content-Type: application/json, and send the current name and message as JSON in the body. I also append the returned message to local state so the new signature appears immediately.

---

## Closing reflection

_Answer in a few sentences each:_

- Why does a `<form>` reload the page by default, and what does `preventDefault`
  actually prevent?
  A form is a native browser navigation mechanism, so submitting it without JavaScript makes the browser load the target URL and replace the current page. Calling preventDefault stops that default navigation so the app can handle the submission in JavaScript.
- Why can a GET not carry your message, while a POST can?
  GET requests are for reading data and do not have a request body for payload data. POST requests are designed to send a body, which is what the API route reads as JSON.
- What is the `Content-Type` header telling the server, and what breaks without
  it?
  It tells the server how to interpret the request body. Without application/json, the server cannot reliably parse the body as JSON, so request.json() has nothing usable to read.

---

**Live URL (Vercel):** _paste here_
