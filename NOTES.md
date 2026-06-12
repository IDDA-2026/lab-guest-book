# Detective notes

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**
The browser treats the `<form>` as a legacy element. When the submit button is clicked, it defaults to a synchronous HTTP navigation, which triggers a page refresh. This refresh clears the React state, causing the inputs to reset and the app to re-mount from scratch.

**What did I ask the AI / what did I look up:**
I looked at the MDN documentation for the `submit` event and `event.preventDefault()`. The docs explained that forms were designed to send data via traditional URL navigation, which is the "default" behavior I needed to override.

**What was the solution:**
I added `e.preventDefault()` as the very first line inside the `handleSubmit` function. This stops the browser from performing its native navigation, allowing me to handle the form submission purely through JavaScript.

---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**
The original code was firing a bare `fetch("/api/messages")` without an options object. By default, `fetch` uses the `GET` method and sends no body. The API’s route handler was expecting a `POST` request with a JSON body, so it had nothing to read or save.

**What did I ask the AI / what did I look up:**
I looked up "MDN using fetch with a JSON body." I needed to understand how to shift from a default `GET` request to a `POST` request that includes specific headers and a payload.

**What was the solution:**
I rebuilt the `fetch` call to include a `method: "POST"`, a `headers` object with `Content-Type: "application/json"`, and a `body` that used `JSON.stringify()` to turn the `name` and `text` state variables into a valid JSON string.

---

## Closing reflection

* **Why does a `<form>` reload the page by default, and what does `preventDefault` actually prevent?** Forms predate modern web applications. Their original purpose was to send data to a server and load the resulting response page. `preventDefault` stops this navigation, effectively "silencing" the browser's default action so that the developer can process the data using an asynchronous API call instead.
* **Why can a GET not carry your message, while a POST can?** A `GET` request is intended for retrieving resources; its semantics are about "reading." A `POST` request is designed to submit data to be processed by the server, allowing for a request body to transport the content of the message.
* **What is the `Content-Type` header telling the server, and what breaks without it?** It acts as a label for the request body. By setting it to `application/json`, we tell the server, "the data attached here is in JSON format, please parse it accordingly." Without it, the server-side `request.json()` call will fail or throw an error because it doesn't know how to interpret the raw stream of bytes it received.

---

**Live URL (Vercel):** *[https://lab-guest-book-phi.vercel.app/](https://lab-guest-book-phi.vercel.app/)*