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

- yarn is another package manager as npm, I saw in one tutorial that its more secure than npm?