import React from 'react';
import ReactDOM from 'react-dom';

import App00 from './components/myFile00';
import App01 from './components/myFile01';
import MyButton from './components/myFileButtons';
import MyForm from './myForm';
import AllUsers from './displayAllUsers';
import DeleteAllUsers from './deleteAllUsers';
import Chat from './pages/Chat';
// import Chat from './components/chat';

ReactDOM.render(<App00 />, document.getElementById('myApp_00'));
ReactDOM.render(<App01 />, document.getElementById('myApp_01'));
ReactDOM.render(<MyButton />, document.getElementById('myButton00'));
ReactDOM.render(<MyForm />, document.getElementById('myForm00'));
ReactDOM.render(<AllUsers />, document.getElementById('displayAllUsers'));
ReactDOM.render(<DeleteAllUsers />, document.getElementById('deleteAllUsers'));
ReactDOM.render(<Chat />, document.getElementById('Chat'));
// ReactDOM.render(<Chat />, document.getElementById('chat'));