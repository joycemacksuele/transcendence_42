import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';

import "./index.css";
import './index.css'
import App_jaka from "./App_jaka.tsx";



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
