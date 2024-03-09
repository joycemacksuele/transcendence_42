import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from "react";

import App from "./app.tsx";

/*
  jQuery
  A JavaScript library that allows developers to quickly write JavaScript by condensing several tasks into a
  single line of code. jQuery is often used in communication with the DOM to make changes to JavaScript elements.
 */

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    
    {/* StrictMode re-renders the components twice, to help debug during development. In production mode it is ignored. */}
    {/* <StrictMode > */}

      <App />

    {/* </ StrictMode > */}
  </Router>
);
