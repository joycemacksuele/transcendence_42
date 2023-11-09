# transcendence_42

<details>
<summary>Backend</summary>
<details>
<summary>NestJS architecture 101</summary>

### High level explanation of the Nest setup:

`main.ts`
Is the entry point of your application (i.e.: the first file that gets executed when you start your NestJS application).
It's responsible for setting up various configurations.

`Module`
Helps you organize and compartmentalize your application into smaller, manageable pieces.
Each module encapsulates related components, such as controllers, providers (services, repositories), and other related modules.
Modules promote modularity, re-usability, and maintainability in your application’s codebase.
I.e.: Is a configuration/header file.

`Controller/Gateway`
Has endpoints to handle incoming HTTP requests, processes them, and returns appropriate HTTP responses.
Controllers are responsible for handling the routing logic and interacting with the service layer to perform various operations.

`Service`
Encapsulates the business logic of your application. 
It is responsible for handling data-related operations, interacting with databases (via the repository),
third-party APIs, or other external resources, and performing tasks that are required by your application’s modules or controllers.

`Repository`
Comunicates with the database or any service that contains data (it's an entry point to the dabatabe).
It also creates a new entry to the already existend table (folowing the table model).
Can also use the Entity to automatically map the database table to the specific entity(ies).

`Entity (aka Model)`
Serves as a model that defines both the structure and functionality of ONE entry of the table on the database (i.e.: it contains an entry/row of a table in code that we can access).
Ultimately, entities lay the groundwork for efficient data storage and interactions within the application.
It can be used by the repository to save the data from the database into an Entity
It can be used by the service to Map the entity to a dto (P.S.: Or this is done automatically?)

`DTO (Data Transfer Objects)`
Similar to a validation checkpoint, ensuring the accuracy and consistency of data as it traverses
different components of the whole application.
Just as a validation process in a real-world scenario scrutinizes input quality, DTOs serve as validators,
scrutinizing incoming data to guarantee it conforms to predefined rules before proceeding.
I.e.: Is a data layer that we receive from the frontend or pass to the frontend -> it aggregates data for the response or to receive in a request

### Extras:

`Decorator`
In NestJS, you can create custom decorators to access any information from the request object.
These decorators can extract user-related data, such as the user’s ID, roles, or any other relevant information,
from the incoming HTTP request.

`Guard`
Protects routes and endpoints by implementing custom logic to control access to certain parts of your application based on various conditions, such as authentication, authorization, role-based access, and more.
One commonly used guard is the JWT (JSON Web Token) guard, which is often used for authentication.
More: https://medium.com/@mohitu531/nestjs-7c0eb5655bde -> Guards

`Routing`
Is an essential aspect of defining how incoming requests are handled and directed to the appropriate parts of your application.
It allows you to map specific routes to controller methods that handle the corresponding business logic.
NestJS provides a built-in module called @nestjs/router to facilitate routing.

<details>
<summary>Project file extensions 101</summary>

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
</details>

###### *Partially from: https://medium.com/@mohitu531/nestjs-7c0eb5655bde*

</details>
</details>

<details>
<summary>Frontend</summary>

<details>
<summary>React</summary>

`function useEffect(effect: EffectCallback, deps?: DependencyList): void;`
- **setup**:
  - The function with your Effect’s logic.
  - Your setup function may also optionally return a cleanup function.
  - When your component is added to the DOM, React will run your setup function.
  - After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values.
   - After your component is removed from the DOM, React will run your cleanup function.
- **deps** (optional):
   - The list of all reactive values referenced inside of the setup code.
  - Reactive values include props, state, and all the variables and functions declared directly inside your component body.
  - React will compare each dependency with its previous value using the Object.is comparison.
  - If you omit this argument, your Effect will re-run after every re-render of the component.
</details>

<details>
<summary>ReactDOM</summary>
Document Object Model, or DOM, is a set of APIs that allow programmes and scripts to access and manipulate the document
tree (the DOM sees a web page as a tree of nodes).
With these APIs, you can have access to the document tree (tree of nodes), and with that access, you can change or
delete the content in that document.

Before we had the ability to manipulate the DOM, web developers could only create a static web page.
Now we can create highly responsive, dynamic and interactive web pages.

One of the most used reactDOM functions is the 'render()' function. It renders the output of the imported function into
a html <div> block (with the corresponding ID in the index.html).

[To read.](https://www.copycat.dev/blog/reactdom/)
</details>

<details>
<summary>UI</summary>

> We have chosen to use: [React Bootstrap](https://react-bootstrap.netlify.app/)
Most used ones: [Bootstrap](https://www.bootstrap-ui.com/), [Material UI](https://mui.com/material-ui/getting-started/) and [Styled Components](https://styled-components.com/). ->
[To read (comparing ui frameworks)](https://ritza.co/articles/tailwind-css-vs-bootstrap-vs-material-ui-vs-styled-components-vs-bulma-vs-sass/)

#### React-Bootstrap vs Bootstrap alone?
Whether you should use React-Bootstrap or simply Bootstrap depends on what you want, need, or expect from
your project, as well as how hands-on you want to be in its creation.

Using the React-Bootstrap integration saves you time because the JavaScript elements are already there, wrapped in neat little React-shaped bows.
If you opt to use Bootstrap as/is, you should be well-versed in JavaScript and JavaScript plug-ins, because
you’ll need to work with those components on your own.
</details>

</details>

<details>
<summary>Common flow with data to be saved or retrieved from the database</summary>

* `FRONTEND`
    - Gets data from a user via the UI, forms an object out of it and sends a requet to the backend with *args=(object -> request-dto)*
    - P.S.: the object is somehow mapped to the dto that the controller/gateway is waiting for
  
- `CONTROLLER/GATEWAY`
    - Decides what it wants from the service and calls the specific funciton/s from it with *args=(request-dto)*
- `SERVICE`
    - Does application logic and as it wants data from the database, it calls the repository with *args=(request-dto / id to search on the database / nothing if we want to get data from the entire table for example)*
- `REPOSITORY`
    - Gets or saves data to/from the database and saves it into entity/ies. Response goes back to services with *args=(entity/ies)*
- `SERVICE`
    - Receives the data, does logic if needed and sends it back to the controller or gateway with *args=(entity/ies -> respose-dto)*
    - P.S.: I don't now yet if this is automatically mapped or we if have to manualy do it (or sometimes we can directly send the entity it seems, not mapping it to a dto ?)
- `CONTROLLER/GATEWAY`
    - Sends the response to the frontend *with args=(respose-dto)*

- `FRONTEND`
    - Receives response (object). P.S.: the dto (or entity) is somehow mapped to the frontend object
    - Forms an UI with this data to show to the user
</details>

-----------------------------

<details>
<summary>npm commands 101</summary>

`npm i --save-dev @types/react @types/react-dom -D`
As we are using typescript, the .tsx file can complain about some imports, so we have to add the types to react and react-dom (don't understand what is it - but its necessary)

`npm start`
To run the application (i.e.: the website + client and server webpack inn this case)

`npm install <package_name> -D`
The -D flag adds it as a dev dependency on the package.json file

`package-lock.json`
Stores all the dependencies for the libraries we added to the package.json

`npm install typescript -D`
As we will use typescript only to develop, it goes into the dev dependencies
</details>

<details>
<summary>Typescript config file 101</summary>

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

`yarn`
Is another package manager as npm, I saw in one tutorial that its more secure than npm?
</details>

-----------------------------

<details>
<summary>Redux</summary>
Redux is a framework used on the frontend of a web application for managing and centralizing application
state (data that can change) consistently across client, server, and native environments
</details>

<details>
<summary>Express</summary>
Used to communicate with our database, it is more secure than axios, and it is server side only, meaning it
listens (then communicates with db) and serves the web requests.

Obs.: In simple words, Express is used to respond to the web requests sent by axios.
</details>

<details>
<summary>Axios</summary>
Used to communicate with our server through api calls (by using `/api` at the beginning of the route).
It is Promise based and also can be used to communicate with other backend apis.
</details>

<details>
<summary>Socket.io</summary>
Websocket allow the browser sessions to be asynchronous (i.e.: 2 or more users and see the data in real time - no refreshing needed).

The main idea behind Socket.IO is that you can send and receive any events you want, with any data you want.
Any objects that can be encoded as JSON will do, and binary data is supported too.

Is composed of two parts:
  - A server that integrates with (or mounts on) the Node.JS HTTP Server socket.io
  - A client library that loads on the browser side socket.io-client

``````
// To broadcast (emit) an event to all connected sockets:
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });

// Use the broadcast flag to exclude a certain emitting socket from the broadcast:
io.broadcast.emit('hi');
``````

**Tip for socket rooms**: Each socket room should have its own entity/table so we can have data persistency since when the socket is closed, the data is lost.

</details>