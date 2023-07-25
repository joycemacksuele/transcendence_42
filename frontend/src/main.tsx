import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App_jaka/css/App_jaka.css";
import App_jaka from "./App_jaka/App_jaka.tsx";
// import App_vite_orig from "./components/example_vite_orig.tsx";
// import SomeText       from './components/ex00_someText.tsx'
// import SomeButtons    from './components/buttons/ex01_someButtons.tsx'
// import ExampleInputField	from './components/forms/RegisterForm.tsx'
// import ExampleFormUserName	from './components/forms/exampleInputUserName.tsx'
// import ExampleDisplayUsers	from './components/forms/exampleDisplayUsers.tsx'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App_vite_orig /> */}
    <App_jaka />

    {/* <SomeText />
		<SomeButtons />
		<ExampleInputField />
		<ExampleFormUserName />
		<ExampleDisplayUsers /> */}
  </React.StrictMode>
);
