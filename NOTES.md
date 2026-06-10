# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

Every time I hit the Sign button, the page flashed and reloaded. I figured React was crashing or resetting state or something, or maybe Next.js was redirecting. I didn't realize forms do this natively.

**What did I ask the AI / what did I look up:**

I looked up "React form submit reloading page" on Google and found a StackOverflow post explaining that HTML forms have this default behavior of trying to submit to the page URL. It said to call `e.preventDefault()`.

**What was the solution:**

I added `e` as an argument to `handleSubmit(e)` and called `e.preventDefault()` right at the start of the function. This stopped the browser from doing its default submit navigation and page reload, so the React state stays intact.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

Even when the page stopped flashing, the messages didn't update. I checked the browser's Network tab and saw the request was just calling `/api/messages` as a default `GET` request. It had no headers, no method, and absolutely no payload, so the server had nothing to save.

**What did I ask the AI / what did I look up:**

I read the server-side code in `app/api/messages/route.js` and saw it does `await request.json()`. Then I looked up "MDN fetch post request" to remember how to format a POST request with headers and a JSON body.

**What was the solution:**

I modified the `fetch` call in `handleSubmit`. I added an options object containing:
- `method: "POST"`
- `headers: { "Content-Type": "application/json" }`
- `body: JSON.stringify({ name: trimmedName, text: trimmedText })`

Then, on a successful `201` response, I took the returned message from the response and appended it to the `messages` array state so it renders on screen without needing a manual page refresh. I also cleared out the input fields.

---

## Closing reflection

- Why does a `<form>` reload the page by default, and what does `preventDefault` actually prevent?
  Forms date back to the early internet before JavaScript was a thing. Back then, a form had to send data by reloading the browser and navigating to a new URL. `preventDefault()` tells the browser not to do that native navigation, letting us handle the data send ourselves in Javascript.
  
- Why can a GET not carry your message, while a POST can?
  GET is designed to retrieve data, so it passes parameters through the URL query string and doesn't carry a payload body. POST is meant for submitting data to be stored, so it carries a request body which can hold the JSON data we want to save.

- What is the `Content-Type` header telling the server, and what breaks without it?
  It tells the server how to interpret the raw bytes it's receiving (in our case, `application/json` tells it to parse it as JSON). Without it, the server won't know how to decode the body, and `request.json()` will throw an error because it doesn't know it's supposed to read JSON.

---

**Live URL (Vercel):** _Not deployed yet (running locally)_
