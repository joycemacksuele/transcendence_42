import { createContext, useContext, useState, ReactNode } from 'react';
// import { createContext } from 'vm';

/*
	Context provides a way to pass data through the component tree without having to pass props down manually at every level. This is especially useful for sharing data that can be considered "global" or shared across multiple components, such as user authentication status, etc ...
*/

// Define the props (all react nodes) - the Provider can wrap all nodes 
interface props {
	children: ReactNode;
}

// Define the content of the Context:
interface SelectedUserContextType {
	selectedLoginName: string | null;
	setSelectedLoginName: (loginName: string | null) => void;
}

// Provide the default empty values of the Context:
const defaultContextValue: SelectedUserContextType = {
	selectedLoginName: null,
	setSelectedLoginName: () => {} // placeholder empty function
}

// Create the Context with the above default values
const ContextSelectedUserName = createContext<SelectedUserContextType>(defaultContextValue);


// Hook for easier usage of useContext for selected user
export const useSelectedUser = () => useContext(ContextSelectedUserName);

// The Provider Component
export const SelectedUserProvider: React.FC<props> = ({ children }) => {
	const [selectedLoginName, setSelectedLoginName] = useState<string | null>(null);

	return (
		<ContextSelectedUserName.Provider value={{ selectedLoginName, setSelectedLoginName }}>
			{children}
		</ContextSelectedUserName.Provider>
	);
}


export default ContextSelectedUserName;
