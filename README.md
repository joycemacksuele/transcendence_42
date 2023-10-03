# transcendence_42

`npm install <package_name> -D`
The -D flag adds it as a dev dependency on the package.json file

`package-lock.json`
Stores all the dependencies for the libraries we added to the package.json

`npm install typescript -D`
As we will use typescript only to develop, it goes into the dev dependencies

-----------------------------

`tsc --init`
To add a typescript config file

- `     "jsx": "preserve",                                /* Specify what JSX code is generated. */`
Change this to `"jsx": "react",`

- `"sourceMap": true,`
For debugging purposes

- `"outDir": "./", `
Used to keep the compiled files

- `"removeComments": true,`
Final output without comments

`index.tsx`
.tsx file will be the first react code using typescript language

-----------------------------

`npm i --save-dev @types/react @types/react-dom -D`
As we are using typescript, the .tsx file can complain about some imports, so we have to add the types to react and react-dom (don't understand what is it - but its necessary)

`npm start`
To run the application (i.e.: the website + client and server webpack inn this case)

-----------------------------

`yarn`
Is another package manager as npm, I saw in one tutorial that its more secure than npm?

--------------------------------------------------------------------------------------------------------------------

## NestJS

`main.ts`
Is the entry point of your application (i.e.: the first file that gets executed when you start your NestJS application).
It's responsible for setting up various configurations.

`Module`
Is a fundamental building block that helps you organize and compartmentalize your application into smaller, manageable pieces.
Each module encapsulates related components, such as controllers, providers (services, repositories), and other related modules.
Modules promote modularity, re-usability, and maintainability in your application’s codebase.

`Controller`
Is a fundamental building block that handles incoming HTTP requests, processes them, and returns appropriate HTTP responses.
Controllers are responsible for handling the routing logic and interacting with the service layer to perform various operations.

`Service`
Is a TypeScript class that encapsulates the business logic of your application.
Services are responsible for handling data-related operations, interacting with databases, third-party APIs,
or other external resources, and performing tasks that are required by your application’s modules or controllers.

`Entity (Model)`
Serves as a model that defines both the structure and functionality of the data within the application’s domain. 
This model acts as a representation of real-world objects and guides how specific data entities are organized and stored.
Ultimately, entities lay the groundwork for efficient data storage and interactions within the application.

`DTO ((Data Transfer Objects)`
Play a crucial role similar to a validation checkpoint, ensuring the accuracy and consistency of data as it traverses
different components of the application.
I.e.: Just as a validation process in a real-world scenario scrutinizes input quality, DTOs serve as validators,
scrutinizing incoming data to guarantee it conforms to predefined rules before proceeding.

`Decorator`
In NestJS, you can create custom decorators to access any information from the request object.
These decorators can extract user-related data, such as the user’s ID, roles, or any other relevant information,
from the incoming HTTP request.

`Guard`
Protects routes and endpoints by implementing custom logic to control access to certain parts of your application based
on various conditions, such as authentication, authorization, role-based access, and more.
One commonly used guard is the JWT (JSON Web Token) guard, which is often used for authentication.
More: https://medium.com/@mohitu531/nestjs-7c0eb5655bde -> Guards

`Routing`
Is an essential aspect of defining how incoming requests are handled and directed to the appropriate parts of your application.
It allows you to map specific routes to controller methods that handle the corresponding business logic.
NestJS provides a built-in module called @nestjs/router to facilitate routing.

*From: https://medium.com/@mohitu531/nestjs-7c0eb5655bde*

--------------------------------------------------------------------------------------------------------------------

## File extensions

`.ts`
Is used for pure TypeScript files.

`.jsx` 
Is an extension to javascript that allow it to process html syntax that would not be recognized otherwise (syntax sugar)
obs.: even though it looks like markup html syntax, it's not. Under the table  jsx is transforming it in what
javascript recognizes, and same to tsx and typescript.

`.tsx` 
Is the extension typescript created to process files containing JSX.

For example, a React component would be .tsx, but a file containing helper functions would be .ts.
Previous to jsx, a .html and .js file would have to be provided to controllers and views.
After jsx, a .html and a .jsx (or .tsx) can be provided.

* Example (not real typescript code):
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