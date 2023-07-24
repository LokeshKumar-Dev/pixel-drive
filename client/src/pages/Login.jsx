import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";

import Navbar from "./Navbar";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    name: false,
    password: false,
    sPass: false,
  });

  const response = async (email, password) => {
    const _response = await axios
      .post("https://pixelapi.onrender.com/user/login", {
        email,
        password,
      })
      .catch((err) => {
        return console.error("login err: ", err);
        // setStatus("error");
      });
    if (_response) {
      localStorage.setItem("token", _response.data.token);
      navigate("/home");
    }
  };
  useEffect(() => {
    const _token = localStorage.getItem("token");
    if (_token && _token !== undefined && _token !== "") {
      navigate("/home");
    }
  }, []);

  const onSubmit = async () => {
    //Login api
    if (name === "" || name === undefined) {
      return setError({ ...error, name: true });
    }
    if (password === "" || password === undefined) {
      return setError({ ...error, password: true });
    }

    response(name, password);
  };

  const googleLogin = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.emails.read",
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        const googleUser = authInstance.currentUser.get();
        const profile = googleUser.getBasicProfile();

        const emailG = profile.getEmail();

        response(emailG, "googlePassword");
      }
    },
  });

  return (
    <>
      <Navbar text="Sign up" link="signup" />
      <section className="login center">
        <div className="login-1">
          <button onClick={() => googleLogin()} className="google-btn cr-p">
            <img src="/google.png" alt="google" /> Login with Google
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
            placeholder="Email"
            className="input"
            value={name}
            onChange={(e) => {
              setError({ ...error, name: false });
              setName(e.target.value);
            }}
            style={{ border: error.name ? "3px solid red" : "" }}
          />
          <input
            type={error.sPass ? "text" : "password"}
            onMouseEnter={() => setError({ ...error, sPass: true })}
            onMouseOut={() => setError({ ...error, sPass: false })}
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
          <button className="btn-submit cr-p" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </section>
    </>
  );
}
