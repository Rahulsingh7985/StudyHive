import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext();

function UserProvider({ children }) {
  const { serverUrl, token, setUser } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);

  // 🔥 GET CURRENT USER
  const getCurrentUser = async () => {
    try {
      if (!token) return;

      const result = await axios.get(`${serverUrl}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(result.data);
      setUser(result.data); // sync with AuthContext

    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [token]); // 🔥 important

  const value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;