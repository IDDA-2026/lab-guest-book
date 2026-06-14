# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

--- *ANSWER*: Updating the mock API was easy but new message now showing problem confused me a little bit. I asked ChatGPT about it and it recommended me to update the messages state variable in my code. So that was the solution.

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

_Your hypothesis here. Why does hitting Sign reload the whole page?_

*ANSWER*: I immidiatly thought about event.preventDefault method or immidiate state change.

**What did I ask the AI / what did I look up:**

_The prompt or doc that helped. What did it tell you?_

*ANSWER*: I solved it myself. I realized that a method that should be in every submit function is missing.

**What was the solution:**

_The actual fix, in your own words. What line did you add, and what does it do?_

---*ANSWER*: I added event.preventDefault method inside the app. It stops browser from refreshing the page as a default behaviour. Which is opposite of what react states and changes work.

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**

_What is wrong with the request the form was firing? What did the Network tab
show you about its method and body?_

*ANSWER*: The form submitting was just sending a GET request of even an empty request. Not a POST request, not even a json body that contains any information. The network tab was just returning default saved messages with a GET method and thats it.

**What did I ask the AI / what did I look up:**

_Your prompt or doc here._
*ANSWER*: I asked ChatGPT about a form submission that does not update when a new element is submitted, and it said that its better to update messages state inside the code too. And i did update the satate after form submission. Here is the link of chat:

https://chatgpt.com/share/6a2e7f1c-08a4-83ed-9bab-8e38e2ca68e2

**What was the solution:**

_How did you rebuild the fetch call? Which pieces did the POST need that the
broken version was missing?_

---*ANSWER*: Originally, code was just calling the mock API without any body or request type. So i sent a request to the mock API with proper json body, including name, text, Content-Type, and method type as POST. And stored the response to a variable.

## Closing reflection

_Answer in a few sentences each:_

- Why does a `<form>` reload the page by default, and what does `preventDefault`
  actually prevent?

  *ANSWER*: Because form submission is set to reload the page by the default behaviour. preventDefault stops it from reloading and instead we can just change or modify parts of the page that changes with React.

- Why can a GET not carry your message, while a POST can?

*ANSWER*: GET method does not read or carry any body. So thats why it does act like there is no body or information in there.

- What is the `Content-Type` header telling the server, and what breaks without
  it?

---*ANSWER*: It specifically tells the browser what type of information is sent/is expexted. Without it, the app might not understand or ready or parse the type of the content sent/received.

**Live URL (Vercel):** _paste here_
