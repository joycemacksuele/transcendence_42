import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import LoginAuth from "./Components/Login_page/Login_auth.tsx";
import InputTFAcode from "./Components/Login_page/Login_2fa";
import MainPage from "./Components/main_page.tsx";
import UserProfilePage from "./Components/Center/Profile/MainProfileComponent.tsx";
import ChatPage from "./Components/Center/Chat/MainComponent.tsx";
import PlayGamePage from "./Components/Center/Game/Game";
import UsersList from "./Components/Center/Users/DisplayUsers.tsx";
import PageNotFound from "./Components/Other/PageNotFound.tsx";
import LogoutPage from "./Components/Login_page/logoutPage.tsx";
import ForcedLogout from "./Components/Other/ForcedLogout.tsx";
import { CurrentUserContext, CurrentUserContextType, CurrUserData } from "./Components/Center/Profile/utils/contextCurrentUser.tsx";
import { SelectedUserProvider } from "./Components/Center/Profile/utils/contextSelectedUserName.tsx";
import { User } from "./Components/Center/Users/DisplayUsers.tsx";
import "./css/default.css";

/*
  'Context' provides a way to pass data through the component tree without having to pass
  props down manually at every level. This is especially useful for sharing data that can
  be considered "global" or shared across multiple components, such as user authentication status, etc ...

  The mechanism for updating the info about the current user in the database, ie: custom profileName.
  The function updateContextValue() is passed as a prop to the sub-components, where it can be used later.
*/

const App: React.FC = () => {
  const [currUserData, setCurrUserData] = useState<CurrUserData | null>({
    loginName: "",
    profileName: "",
    profileImage: "",
    allUsers: [],
  });

  // Function to update allUsers in the Context , todo: move to the context file
  const setAllUsers = (users: User[]) => {
    setCurrUserData(current => {
      if (current !== null) {
        return {      // If current is not null, safely spread and update
          ...current, // Keep current values of loginName ...
          allUsers: users,
        };
      } else {
        return {  // Provide default values if current is null
          loginName: "",
          profileName: "",
          profileImage: "",
          allUsers: users,
        };
      }
    });
  };

  // The UserContext to be available everywhere, because it wraps all components via
  //   via the CurrentUserContext.Provider    
  const currUserContext: CurrentUserContextType = {
    loginName: currUserData?.loginName ?? "",
    profileName: currUserData?.profileName ?? "",
    profileImage: currUserData?.profileImage ?? "",
    allUsers: currUserData?.allUsers ?? [],
    setAllUsers,
  };

  // Load CSS file
  useEffect(() => {
    const loadCSS = (cssFile: string) => {
      const link = document.createElement("link");
      link.href = `/frontend/src/css/${cssFile}`;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.id = "theme-style";
      document.head.appendChild(link);
    };

    // Check if CSS file is already in local storage
    const storedCSS = localStorage.getItem("css-file");
    if (storedCSS) {
      loadCSS(storedCSS);
    } else {
      localStorage.setItem("css-file", "default.css");
      loadCSS("default.css");
    }

    // Listen for changes in storage (in case of deleting the local storage)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "css-file") {
        loadCSS(event.newValue || "default.css");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      // Important to remove the listener when the component unmounts.
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <CurrentUserContext.Provider value={currUserContext}>
        <SelectedUserProvider>
          <Routes>
            <Route path="/" element={<LoginAuth />} />
            <Route path="/Login_2fa" element={<InputTFAcode />} />

            <Route
              path="/main_page"
              element={<MainPage updateContext={setCurrUserData} />}
            >
                <Route
                  path="/main_page/profile"
                  element={<UserProfilePage updateContext={setCurrUserData} />}
                />
                <Route path="/main_page/chat" element={<ChatPage />} />
                <Route path="/main_page/game" element={<PlayGamePage />} />
                <Route path="/main_page/users" element={<UsersList />} />
            </Route>

            <Route path="logout" element={<LogoutPage />} />
            <Route path="forced-logout" element={<ForcedLogout />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </SelectedUserProvider>
      </CurrentUserContext.Provider>
    </>
  );
};

export default App;
