# Detective notes

This is your deliverable. We grade the *thinking*, not the word count. Be honest
about what confused you and what unstuck you. Short and real beats long and fake.

---

## Bug 1: the page reloads and my message vanishes

**What I think is wrong (before fixing):**

I think the problem is that the form is doing its normal browser behavior but it just doesn't save the inputs somewhere at all. When I click Sign, the browser submits the form and reloads the page,but since it doesn't save I can't see the data i entered..

**What did I ask the AI / what did I look up:**

I asked AI that: I have a lab where I have to solve a issue about the entered data vanishing.We are using VSCode. Html css and Js for coding. When I reload the page or just click sign button,it doesn't save it but clears the input.What could be the reason for that problem?

**What was the solution:**
AI said: 
I would first check:

Whether the form submit handler uses event.preventDefault().
Whether the request in the Network tab is a POST request.
Whether the request contains a JSON body with the entered data.
Whether the server returns a successful response (such as status 201).
---

## Bug 2: even without the reload, nothing gets saved

**What I think is wrong (before fixing):**
If I'm being honest I didnt think about those bugs seperately,so I fixed them at one time with help of ai.

**What did I ask the AI / what did I look up:**
I sent that:
"Bug 2: even without the reload, nothing gets saved. Whether the form submit handler uses event.preventDefault().
Whether the request in the Network tab is a POST request.
Whether the request contains a JSON body with the entered data.
Whether the server returns a successful response (such as status 201).

Which of those could be the cause? And how can I check it? "

**What was the solution:**
For Bug 2, the likely causes are these three:

- The request is not a POST request.
- The request does not contain a JSON body.
- The server does not return status 201.
(ofc it was longer I just pasted the short summary part of the chat.)

## Closing reflection

- Why does a `<form>` reload the page by default, and what does `preventDefault`
  actually prevent?
In default it automatically refreshes the page,prevent default prevents that from being happen.
- Why can a GET not carry your message, while a POST can?
GET is used to ask for information, while POST is used to send new information.
- What is the `Content-Type` header telling the server, and what breaks without
  it?
It is like a warning like: "Be careful,this content is in JSON format"

---
**Live URL (Vercel):** (I forgot sorry,if I have time left today I'll deploy and push again)
