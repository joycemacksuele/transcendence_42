// import React from "react";
// import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';

import "./index.css";
import App_jaka from "./App_jaka.tsx";

// import App_vite_orig from "./components/example_vite_orig.tsx";
// import SomeText       from './components/ex00_someText.tsx'
// import SomeButtons    from './components/buttons/ex01_someButtons.tsx'
// import ExampleInputField	from './components/forms/RegisterForm.tsx'
// import ExampleFormUserName	from './components/forms/exampleInputUserName.tsx'
// import ExampleDisplayUsers	from './components/forms/exampleDisplayUsers.tsx'

/*
  jQuery
  A JavaScript library that allows developers to quickly write JavaScript by condensing several tasks into a
  single line of code. jQuery is often used in communication with the DOM to make changes to JavaScript elements.
 */


ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    {/* StrictMode was re-rendereing the components twice, to find errors as far as I know */}

    <App_jaka />

    {/* </ StrictMode > */}
  </Router>
);
