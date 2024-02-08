import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import LoginAuth from "./Components/Login_page/Login_auth.tsx";
import InputTFAcode from "./Components/Login_page/Login_2fa";
import MainPage from "./Components/main_page.tsx";
import UserProfilePage from "./Components/Center/Profile_page/User_profile_page";
import ChatPage from "./Components/Center/Chat/Chat";
import PlayGamePage from "./Components/Center/Game/Game";
import UsersList from "./Components/Center/Profile_page/DisplayUsers";
import PageNotFound from "./Components/Other/PageNotFound.tsx";
import LogoutPage from "./Components/Login_page/logoutPage.tsx";
import ForcedLogout from "./Components/Other/ForcedLogout.tsx";
import {
  CurrentUserContext,
  CurrUserData,
} from "./Components/Center/Profile_page/contextCurrentUser.tsx";
import { SelectedUserProvider } from "./Components/Center/Profile_page/contextSelectedUserName.tsx";
import "./css/default.css";

// 'Context' provides a way to pass data through the component tree without having to pass
// props down manually at every level. This is especially useful for sharing data that can
// be considered "global" or shared across multiple components, such as user authentication status, etc ...

const App: React.FC = () => {
  // console.log("envvvvvvvvvvvvvv VITE", import.meta.env.VITE_BACKEND);

  /*
		The mechanism for updating the info about the current user in the database, ie: custom profileName.
		THe function updateContextValue() is passed as a prop to the sub-components, where it can be used later.
	*/
  const [currUserData, setCurrUserData] = useState<CurrUserData | null>({
    loginName: "",
    profileName: "",
    profileImage: "",
  });

  useEffect(() => {
    // Load CSS file
    const loadCSS = (cssFile: string) => {
      const link = document.createElement("link");
      link.href = `/frontend/src/css/${cssFile}`; // NOT SURE ???
      link.type = "text/css";
      link.rel = "stylesheet";
      link.id = "theme-style";
      document.head.appendChild(link);
      // console.log("< < < < < < < < < link", link);
    };

    // Check if CSS file is already in local storage
    const storedCSS = localStorage.getItem("css-file");
    if (storedCSS) {
      // console.log("< < < < < < < < < storedCSS", storedCSS);
      loadCSS(storedCSS);
    } else {
      // console.log("< < < < < < < < < else storedCSS", storedCSS);
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
      // IMPORTANT TO CLEAN UP THE EVENT LISTENER WHEN THE COMPONENT UNMOUNTS!
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <CurrentUserContext.Provider value={currUserData as CurrUserData}>
        <SelectedUserProvider>
          <Routes>
            <Route path="/" element={<LoginAuth />} />
            <Route path="/Login_2fa" element={<InputTFAcode />} />
            {/* <Route path="/auth-callback"	element={<AuthCallbackPage />}/> */}

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
