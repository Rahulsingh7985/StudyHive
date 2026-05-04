import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Contexts
import AuthProvider from "./context/AuthContext.jsx";
import UserProvider from "./context/UserContext.jsx";
import RoomProvider from "./context/RoomContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="270211681158-1e1s6uuo4cc1vejnhciotbpqnn6ijs4n.apps.googleusercontent.com">
    <AuthProvider>
      <UserProvider>
        <RoomProvider>
          <App />
        </RoomProvider>
      </UserProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);