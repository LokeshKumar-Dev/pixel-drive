import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Navbar from "./Navbar";
import MemoImage from "./MemoImage";

import "./home.css";

const imageUrl =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80";

export default function Home() {
  const navigate = useNavigate();

  const [modal, setModal] = useState({ status: false, url: "" });
  const [tabs, setTabs] = useState(0);
  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(false);
  const [s3Image, setS3Image] = useState([]);
  const [driveImage, setDriveImage] = useState([]);

  useEffect(() => {
    const _token = localStorage.getItem("token");
    if (_token === undefined || _token === "") return navigate("/");

    const userApi = async () => {
      const res = await axios
        .get("http://localhost:4000/user/profile", {
          headers: { Authorization: `Bearer ${_token}` },
        })
        .catch((err) => {
          return console.error("err ", err);
        });

      console.log("home", res);
      if (res === undefined) return;
      setUser(res.data);
      s3Api();
    };

    const s3Api = async () => {
      console.log("s23");
      setLoading(true);
      const res = await axios.get("http://localhost:4000/images/s3", {
        headers: { Authorization: `Bearer ${_token}` },
      });
      console.log("s3", res);
      setLoading(false);
      setS3Image(res.data);
    };

    userApi();
  }, []);

  useEffect(() => {
    const _token = localStorage.getItem("token");
    if (driveImage.length > 0) return;

    const driveApi = async () => {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/images/drive", {
        headers: { Authorization: `Bearer ${_token}` },
      });
      console.log("drive", res);
      setLoading(false);
      setDriveImage(res.data);
    };
    driveApi();
  }, [tabs]);

  return (
    <>
      <Navbar text="Sign up" show={true} userName={user.name} />
      <section className="home">
        <div className="tabs">
          <div
            className={`tab-1 ${!tabs ? "tab-active" : ""} cr-p`}
            onClick={() => setTabs(0)}
          >
            S3
          </div>
          <div
            className={`tab-2 ${tabs ? "tab-active" : ""} cr-p`}
            onClick={() => setTabs(1)}
          >
            google drive
          </div>
        </div>
        <div className="content">
          {!tabs ? (
            <div className="content-1" style={{ position: "relative" }}>
              {loading ? (
                <div class="loader" style={{ top: "50%", left: "50%" }} />
              ) : (
                s3Image.map((image, i) => {
                  return (
                    <div
                      key={i}
                      className="content-box cr-p"
                      onClick={() => setModal({ status: true, url: image.url })}
                    >
                      <img src={image.url} className="content-box--image" />
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="content-2">
              {loading
                ? "loading"
                : driveImage.map((image, i) => {
                    return (
                      <div
                        key={i}
                        className="content-box cr-p"
                        onClick={() =>
                          setModal({ status: true, url: image.url })
                        }
                      >
                        <MemoImage src={image.url} />
                      </div>
                    );
                  })}
            </div>
          )}
        </div>
        <section className={modal.status ? "modal-show modal" : "modal"}>
          <div>
            <span
              className="cr-p"
              onClick={() => setModal({ ...modal, status: false })}
              style={{ marginRight: "20px" }}
            >
              download
            </span>
            <span
              className="cr-p"
              onClick={() => setModal({ ...modal, status: false })}
            >
              close
            </span>
          </div>
          <img className="modal-image" src={modal.url} alt="" />
        </section>
      </section>
    </>
  );
}
