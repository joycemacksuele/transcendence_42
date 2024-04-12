import React from 'react';
import { User } from '../../Users/DisplayUsers';

/*
	Context provides a way to pass data through the component tree without having to pass 
	props down manually at every level. This is especially useful for sharing data that can 
	be considered "global" or shared across multiple components, such as user authentication status, etc ...
*/

// TODO can we make those not undefined?
export interface CurrUserData {
	loginName:	string | undefined;
	profileName: string | undefined;
	profileImage:	string | undefined;
	allUsers?: User[];	// Using this Context to also have the allUsers array, to be able to grab onlineStatus of each user
	//setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

// Todo: is it possible to define setAllUsers() here, add it to CurrUserData and 
// then remove the 'extends' ??
export interface CurrentUserContextType extends CurrUserData {
	setAllUsers: (users: User[]) => void;
}

// export const CurrentUserContext = React.createContext<CurrUserData | null> (null);
export const CurrentUserContext = React.createContext<CurrentUserContextType | null>(null);

