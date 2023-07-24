import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { gapi } from 'gapi-script';


import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./app.css";

export default function App() {
  useEffect(() => {
    // Load the Google API Client Library
    gapi.load("client:auth2", initClient);
  }, []);

  const initClient = async () => {
    try {
      await gapi.client.init({
        apiKey: "AIzaSyAjNCCsbz_5utmTKWGv9zE_J8smOrltX1Q",
        clientId:
          "835021367507-slm0a3vc03fu13u9tj8qf4tuqg5u907c.apps.googleusercontent.com",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
        ],
        scope: "profile email",
      });
    } catch (error) {
      console.error("Error initializing Google API client:", error);
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId="835021367507-slm0a3vc03fu13u9tj8qf4tuqg5u907c.apps.googleusercontent.com">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route path="" element={<Login />} />
              <Route path="home" element={<Home />} />
              <Route path="signup" element={<Signup />} />
              {/* <Route path="*" element={<NoPage />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
      {/* <Signup /> */}
    </>
  );
}
