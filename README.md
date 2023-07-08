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

## Javascript
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

# P.s.: Should we use .tsx??

--------------------------------------------------------------------------------------------------------------------

## Redux

What is it?