import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from  "/JobZee-logos__white.png";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { token, setToken, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Logout: ", token);
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setToken("");
      localStorage.removeItem("token");
      toast.success(response.data.message);
        navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  return (
    <nav className={token ? "navbarShow" : "navbarHide"}>
      <div className="container">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <Link to={"/"} onClick={() => setShow(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to={"/job/getall"} onClick={() => setShow(false)}>
              ALL JOBS
            </Link>
          </li>
          <li>
            <Link to={"/applications/me"} onClick={() => setShow(false)}>
              {user && user.role === "Employer"
                ? "APPLICANT'S APPLICATIONS"
                : "MY APPLICATIONS"}
            </Link>
          </li>
          {user && user.role === "Employer" ? (
            <>
              <li>
                <Link to={"/job/post"} onClick={() => setShow(false)}>
                  POST NEW JOB
                </Link>
              </li>
              <li>
                <Link to={"/job/me"} onClick={() => setShow(false)}>
                  VIEW YOUR JOBS
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}

          <button onClick={handleLogout}>LOGOUT</button>
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;