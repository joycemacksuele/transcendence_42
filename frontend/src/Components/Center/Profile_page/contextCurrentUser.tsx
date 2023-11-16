import React from 'react';

/*
	Context provides a way to pass data through the component tree without having to pass 
	props down manually at every level. This is especially useful for sharing data that can 
	be considered "global" or shared across multiple components, such as user authentication status, etc ...
*/

export interface CurrUserData {
	loginName:	string | undefined;
	profileName: string | undefined;
	profileImage:	string | undefined;
}

export const CurrentUserContext = React.createContext<CurrUserData | null> (null);
