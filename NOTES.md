# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

There were 2 issues — one was that the page was reloading on sign button click,
that is on form submit. First thing I noticed was that `handleSubmit` does not
have `e.preventDefault()` — the browser was just navigated by the form.

**What did I ask the AI / what did I look up:**

No need to use AI for this one. I opened the code of `route.js`, analyzed it,
then opened `page.js`.

**What was the solution:**

I fixed it by adding `e.preventDefault()` first — that is we say stop to the
process.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

The other issue was that even when clicking, nothing was saved. Then I noticed
the awful structure of the method itself — it was violating POST request rules:
no response handling, no method declaration, no body, no headers.

**What did I ask the AI / what did I look up:**

No need to use AI for this one either.

**What was the solution:**

I used the standard POST request structure given in the portal materials and fit
it into our project.

---

## Closing reflection

- **Why does a `<form>` reload the page by default, and what does `preventDefault`
  actually prevent?** A form's default job is to send its data to a URL and
  navigate the browser there — that is the reload you see. `preventDefault()` stops
  that default navigation so JavaScript can handle the submit instead (with
  `fetch`, without losing React state).

- **Why can a GET not carry your message, while a POST can?** GET is for asking
  the server for data. POST is for sending data to be saved. Our broken code used
  GET with no body, so the server had nothing to store. POST carries a JSON body
  with `name` and `text`.

- **What is the `Content-Type` header telling the server, and what breaks without
  it?** It tells the server how to read the body — `application/json` means
  "parse this as JSON." Our route uses `request.json()`, so without that header
  the server may not read `name` and `text` correctly.

---

**Live URL (Vercel):** https://lab-guest-book-pi.vercel.app
