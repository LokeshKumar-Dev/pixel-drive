import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./app.css";

export default function App() {
  return (
    <>
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

      {/* <Signup /> */}
    </>
  );
}
