import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from "react";

import App from "./app.tsx";

/*
  jQuery
  A JavaScript library that allows developers to quickly write JavaScript by condensing several tasks into a
  single line of code. jQuery is often used in communication with the DOM to make changes to JavaScript elements.
 */

  /*
    This is the top main file, responsible for the intial setup of the application. It's the entry point, it sets up the React root and wraps the <App /> component with the <Router>. This manages routing throughout the application.
  */

  /*
    The <Router> is a component is used to manage navigation between different components (pages) in a single-page application (SPA). It enables the app to change views based on the browser's URL without reloading the entire page, effectively mimicking the navigation of a multi-page website within a single HTML document.
  */

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    {/* StrictMode re-renders the components twice, to help debug during development. In production mode it is ignored. */}

    {/* <StrictMode > */}
      <App />
    {/* </ StrictMode > */}
  
  </Router>
);
