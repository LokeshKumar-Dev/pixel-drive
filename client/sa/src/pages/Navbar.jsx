import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Navbar({ text, link, show, userName }) {
  const imageUrl =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80";
  return (
    <nav className="nav">
      <div className="nav-1">
        <img src="/logo.svg" alt="pixel" className="nav-1--logo cr-p" />
      </div>
      <div className="nav-2">
        {show !== undefined || show ? (
          <div className="user">
            <h6 className="user-name">{"Hi! " + userName}</h6>
            <img src={imageUrl} alt="profile" className="user-image" />
          </div>
        ) : (
          <Link to={`/${link}`}>
            <button className="nav-2--btn cr-p">{text}</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
