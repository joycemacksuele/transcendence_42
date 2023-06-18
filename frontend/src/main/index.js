import React from 'react';
import ReactDOM from 'react-dom';

import App00 from './myFile00';
import App01 from './myFile01';


/*
    ReactDOM is a library with functions, like 'render()'
    Render() is a function to 'render' the output of the imported
    function App00 into a html <div> block (corresponding ID in the index.html).

    In myFile.js there is a myFunction() that outputs html text.
*/
ReactDOM.render(<App00 />, document.getElementById('myApp_00'));

ReactDOM.render(<App01 />, document.getElementById('myApp_01'));