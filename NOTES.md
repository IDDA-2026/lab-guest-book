# Notes

## What was broken?

The guestbook form was reloading the page whenever the user clicked Sign. Because of the page reload, React state was lost and the entered values disappeared.

There was also a second issue: the request sent by the form was not saving any data on the server because it was not sending a proper POST request with a JSON body.

## What I changed

1. Added `e.preventDefault()` inside the submit handler to stop the browser's default form submission behavior.
2. Changed the request to use the `POST` method.
3. Added the `Content-Type: application/json` header.
4. Sent the form data using `JSON.stringify({ name, text })`.
5. Parsed the server response with `response.json()`.
6. Updated the local `messages` state using `setMessages(...)` so the new message appears immediately.
7. Cleared the input fields after a successful submission.

## What I learned

* Why forms reload the page by default.
* How `preventDefault()` works.
* The difference between GET and POST requests.
* How to send JSON data using `fetch`.
* How to update React state after receiving data from an API.

## Testing

Verified that:

* The page no longer reloads on submit.
* A POST request is sent to `/api/messages`.
* The request contains a JSON body.
* The server returns status `201`.
* The new message appears immediately in the list.
* The inputs are cleared after submission.
* Messages remain visible after refreshing the page while the dev server is running.
