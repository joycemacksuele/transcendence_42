import React from 'react'
import ReactDOM from 'react-dom/client'
import App_vite_orig from './components/example_vite_orig.tsx'
import SomeText from './components/ex00_someText.tsx'
import SomeButtons from './components/buttons/ex01_someButtons.tsx'
import ExampleFormUserName from './components/forms/exampleInputUserName.tsx'
import ExampleDisplayUsers from './components/forms/exampleDisplayUsers.tsx'
import ChatInputField from './components/forms/chatForm.tsx'
import './utils/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>

		<App_vite_orig />
		<SomeText />
		<SomeButtons />
		<ExampleFormUserName />
		<ExampleDisplayUsers />
		<ChatInputField />

	</React.StrictMode>,
)
