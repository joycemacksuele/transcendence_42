# transcendence_42

`npm install <package_name> -D`
the -D flag adds it as a dev dependency on the package.json file

`package-lock.json`
stores all the dependencies for the libraries we added to the package.json

`npm install typescript -D`
as we will use typescript only to develop, it goes into the dev dependencies

-----------------------------

`tsc --init`
to add a typescript config file

- `     "jsx": "preserve",                                /* Specify what JSX code is generated. */`
change this to `"jsx": "react",`

- `"sourceMap": true,`
for debugging purposes

- `"outDir": "./", `
used to keep the compiled files

- `"removeComments": true,`
so final output has not comments

`index.tsx`
.tsx file will be the first react code using typescript language

-----------------------------

`npm i --save-dev @types/react @types/react-dom -D`
as we are using typescript, the .tsx file can complain about some imports, so we have to add the types to react and react-dom (don't understand what is it - but its necessary)

`npm start`
to run the application (i.e.: the website + client and server webpack inn this case)

-----------------------------

`yarn`
is another package manager as npm, I saw in one tutorial that its more secure than npm?

--------------------------------------------------------------------------------------------------------------------

## File extensions

`.ts`
is used for pure TypeScript files.

`.jsx` 
is an extension to javascript that allow it to process html syntax that would not be recognized otherwise (syntax sugar)
obs.: even though it looks like markup html syntax, it's not. Under the table  jsx is transforming it in what
javascript recognizes, and same to tsx and typescript.

`.tsx` 
is the extension typescript created to process files containing JSX.

For example, a React component would be .tsx, but a file containing helper functions would be .ts.
Previous to jsx, a .html and .js file would have to be provided to controllers and views.
After jsx, a .html and a .jsx (or .tsx) can be provided.

* example (not real typescript code):
  * without .tsx:
    `let var: React.createElemet("p", {}, "Hello");`
  * with .tsx:
        `let var: <p>Hello</p>;`

--------------------------------------------------------------------------------------------------------------------

## ReactDOM

Document Object Model, or DOM, is a set of APIs that allow programmes and scripts to access and manipulate the document
tree (the DOM sees a web page as a tree of nodes).
With these APIs, you can have access to the document tree (tree of nodes), and with that access, you can change or
delete the content in that document.

Before we had the ability to manipulate the DOM, web developers could only create a static web page.
Now we can create highly responsive, dynamic and interactive web pages.

One of the most used reactDOM functions is the 'render()' function. It renders the output of the imported function into
a html <div> block (with the corresponding ID in the index.html).

[To read.](https://www.copycat.dev/blog/reactdom/)

--------------------------------------------------------------------------------------------------------------------

## Redux

Redux is a framework used on the frontend of a web application for managing and centralizing application
state (data that can change) consistently across client, server, and native environments

--------------------------------------------------------------------------------------------------------------------

## Axios

Used to communicate with our server through api calls (by using `/api` at the beginning of the route).
It is Promise based and also can be used to communicate with other backend apis.

--------------------------------------------------------------------------------------------------------------------

## Express

Used to communicate with our database, it is more secure than axios, and it is server side only, meaning it
listens (then communicates with db) and serves the web requests.

Obs.: In simple words, Express is used to respond to the web requests sent by axios.

--------------------------------------------------------------------------------------------------------------------

## Socket.io

The main idea behind Socket.IO is that you can send and receive any events you want, with any data you want.
Any objects that can be encoded as JSON will do, and binary data is supported too.

Is composed of two parts:
- A server that integrates with (or mounts on) the Node.JS HTTP Server socket.io
- A client library that loads on the browser side socket.io-client

To broadcast (emit) an event to all connected sockets:
E.g.: `io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });`
Use the broadcast flag to exclude a certain emitting socket from the broadcast:
E.g.: `io.broadcast.emit('hi');`

--------------------------------------------------------------------------------------------------------------------

## UI

Most used ones: [Bootstrap](https://www.bootstrap-ui.com/), [Material UI](https://mui.com/material-ui/getting-started/) and [Styled Components](https://styled-components.com/).

[To read (comparing ui frameworks)](https://ritza.co/articles/tailwind-css-vs-bootstrap-vs-material-ui-vs-styled-components-vs-bulma-vs-sass/)