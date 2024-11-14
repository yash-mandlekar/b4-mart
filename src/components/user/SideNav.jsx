import React, { useEffect, useState } from "react";
import "../../Css/Home.css";
import { IoClose } from "react-icons/io5";

import { Link, NavLink } from "react-router-dom";
import Vector from "../../assets/Vector.svg";
import Profile from "../../assets/profile.svg";
import Notification from "../../assets/notification.svg";
import search from "../../assets/search.svg";
import cartlogo from "../../assets/cart.svg";
import location from "../../assets/location.svg";
import Location from "./Location";
import Logout from "../../assets/logout.svg";
import Logo from "../common/Logo";
import { asynclogout } from "../../store/userActions";
import { useDispatch, useSelector } from "react-redux";

const SideNav = () => {
  const Dispatch = useDispatch();
  const [counter, setcounter] = useState(0);
  const { cart, user } = useSelector((state) => state.user);

  useEffect(() => {
    var count = 0;
    cart.map((e) => {
      count += e.count;
    });
    setcounter(count);
  }, [cart]);
  const handleLogout = async () => {
    if (window.confirm("Are you really want to logout?")) {
      Dispatch(asynclogout());
      document.cookie = "token=";
    }
  };

  return (
    <div className="sideNav">
      <Logo />
      <div className="sideNavBase">
        <div className="navTop">
          <NavLink
            to="/home"
            end
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            <img src={Vector} alt="" />
          </NavLink>

          <NavLink to={"/home/orders"}>
            <img src={Notification} alt="" />
          </NavLink>

          {/* <NavLink to={"/home/search"}>
            <img src={search} alt="" />
          </NavLink> */}
          <NavLink
            to="/home/cart"
            id="cartOption"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            {counter > 0 && <div className="circ">{counter}</div>}
            <img src={cartlogo} alt="" />
          </NavLink>
          <div className="location">
            <img src={location} alt="" />
            <div className="address">
              <img src={location} alt="" />
              <Location />
            </div>
          </div>
        </div>

        <div className="navBottom">
          <button onClick={handleLogout} className="logout">
            <img src={Logout} alt="" />
          </button>
          <Link to="/home/profile" className="profile">
            <img src={user?.profilepic} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
