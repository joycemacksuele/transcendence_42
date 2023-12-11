import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';

import App from "./app.tsx";
// import 'bootstrap/dist/css/bootstrap.min.css';

/*
  jQuery
  A JavaScript library that allows developers to quickly write JavaScript by condensing several tasks into a
  single line of code. jQuery is often used in communication with the DOM to make changes to JavaScript elements.
 */

// localStorage.setItem('css-file', 'default.css');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    {/* StrictMode was re-rendereing the components twice, to find errors as far as I know */}

    <App />

    {/* </ StrictMode > */}
  </Router>
);
