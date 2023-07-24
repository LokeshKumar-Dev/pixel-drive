import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";

import Navbar from "./Navbar";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
    cPassword: false,
    sPass1: false,
    sPass2: false,
  });

  const onSubmit = async () => {
    console.log("first");
    if (name === "" || name === undefined) {
      return setError({ ...error, name: true });
    }
    if (email === "" || email === undefined) {
      return setError({ ...error, email: true });
    }
    if (password === "" || password === undefined || password.length < 8) {
      return setError({ ...error, password: true });
    }
    if (cPassword === "" || cPassword === undefined || cPassword !== password) {
      return setError({ ...error, cPassword: true });
    }

    const response = await axios
      .post("https://pixelapi.onrender.com/user/", {
        name,
        email,
        password,
      })
      .catch((err) => {
        return console.error("login err: ", err);
        // setStatus("error");
      });

    if (response) {
      navigate("/");
    }
  };

  const googleLogin = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.emails.read",
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        const googleUser = authInstance.currentUser.get();
        const profile = googleUser.getBasicProfile();

        const nameG = profile.getName();
        const emailG = profile.getEmail();

        const response = await axios
          .post("https://pixelapi.onrender.com/user/", {
            name: nameG,
            email: emailG,
            password: "googlePassword",
          })
          .catch((err) => {
            if (err.response.status === 400) return navigate("/");
            return console.error("login err: ", err);
            // setStatus("error");
          });

        if (response) {
          navigate("/");
        }
      }
    },
  });
  return (
    <>
      <Navbar text="Login" link="" />
      <section className="login center">
        <div className="login-1">
          <button onClick={() => googleLogin()} className="google-btn cr-p">
            <img src="/google.png" alt="google" /> Signup with Google
          </button>
        </div>
        <div className="mid">
          <hr className="line"></hr>
          <span className="text">OR</span>
          <hr className="line"></hr>
        </div>
        <div className="login-2">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input"
            value={name}
            onChange={(e) => {
              setError({ ...error, name: false });
              setName(e.target.value);
            }}
            style={{ border: error.name ? "3px solid red" : "" }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => {
              setError({ ...error, email: false });
              setEmail(e.target.value);
            }}
            style={{ border: error.email ? "3px solid red" : "" }}
          />
          <input
            type={error.sPass1 ? "text" : "password"}
            onMouseEnter={() => setError({ ...error, sPass1: true })}
            onMouseOut={() => setError({ ...error, sPass1: false })}
            name="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => {
              setError({ ...error, password: false });
              setPassword(e.target.value);
            }}
            style={{ border: error.password ? "3px solid red" : "" }}
          />
          <input
            type={error.sPass2 ? "text" : "password"}
            onMouseEnter={() => setError({ ...error, sPass2: true })}
            onMouseOut={() => setError({ ...error, sPass2: false })}
            name="cPassword"
            placeholder="Confirm Password"
            className="input"
            value={cPassword}
            onChange={(e) => {
              setError({ ...error, cPassword: false });
              setCPassword(e.target.value);
            }}
            style={{ border: error.cPassword ? "3px solid red" : "" }}
          />
          <button className="btn-submit cr-p" onClick={onSubmit}>
            Sign up
          </button>
        </div>
      </section>
    </>
  );
}
