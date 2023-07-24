import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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

    const response = await axios
      .post("http://localhost:4000/user/login", {
        email: name,
        password,
      })
      .catch((err) => {
        return console.error("login err: ", err);
        // setStatus("error");
      });

    if (response) {
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    }
  };
  return (
    <>
      <Navbar text="Sign up" link="signup" />
      <section className="login center">
        <div className="login-1">Login In G</div>
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
