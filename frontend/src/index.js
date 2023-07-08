// Commend by JOYCE
// I think we need an index.tsx not a javascript one.
// EX: (Look on my branch, inside transcendence_42/react-typescript-test/src/index.tsx):
//
// import React from 'react';
// import ReactDOM from 'react-dom';
//
// ReactDOM.render(
//     <div>
//         Hello MB Channel
//         <h1>Thanks for watching! :)</h1>
//     </div>,
//     // we get the element with id "root"from the html file, that is why we need that element there
//     document.getElementById('root')
// )

import React from 'react';
import ReactDOM from 'react-dom';

import App00 from './myFile00';
import App01 from './myFile01';
import MyButton from './myFileButtons';
import MyForm from './myForm';
import AllUsers from './displayAllUsers';
import DeleteAllUsers from './deleteAllUsers';

/*
    ReactDOM is a library with functions, like 'render()'
    Render() is a function to 'render' the output of the imported 
    function App00 into a html <div> block (corresponding ID in the index.html).

    In myFile.js there is a myFunction() that outputs html text.
*/

ReactDOM.render(<App00 />, document.getElementById('myApp_00'));
ReactDOM.render(<App01 />, document.getElementById('myApp_01'));
ReactDOM.render(<MyButton />, document.getElementById('myButton00'));
ReactDOM.render(<MyForm />, document.getElementById('myForm00'));
ReactDOM.render(<AllUsers />, document.getElementById('ShowAllUsers'));
ReactDOM.render(<DeleteAllUsers />, document.getElementById('deleteAllUsrs'));