// src/components/Sidebar.js
import React, { useState } from "react";
import "../../Css/Sidebar.css";
import Logo from "../../Images/B4mart.png";
import Orders from "../../Images/orders.png";
import Dash from "../../Images/dash.webp";
import Log from "../../Images/log.jpg";
import Users from "../../Images/users.jpg";
import Shops from "../../Images/shops.jpeg";
import Profile from "../../Images/profile.jpg";
import Product from "../../Images/product.webp";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asynclogout } from "../../store/userActions";
export default function Sidebar() {
  const { role, user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const Dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = async () => {
    if (window.confirm("Are you really want to logout?")) {
      Dispatch(asynclogout());
      document.cookie = "token=";
      navigate("/admin-login");
    }
  };

  return (
    <div className="holo">
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div>
          <Link to="/home" className="sidebar-header">
            <img src={Logo} alt="B4Mart Logo" className="logo" />
            <h2>B4Mart</h2>
          </Link>

          <ul className="sidebar-menu">
            <li className="creature">
              <Link to="/admin">
                <img src={Dash} alt="" />
                <h3> Dashboard</h3>
              </Link>
            </li>
            {role == "admin" && (
              <>
                <li className="creature">
                  <Link to="/admin/shops">
                    <img src={Shops} alt="" />
                    <h3>Shops</h3>
                  </Link>
                </li>
                <li className="creature">
                  <Link to="/admin/users">
                    <img src={Users} alt="" />
                    <h3> Users</h3>
                  </Link>
                </li>
              </>
            )}
            <li className="creature">
              <Link to="/admin/products">
                <img src={Product} alt="" />
                <h3> Products</h3>
              </Link>
            </li>
            <li className="creature">
              <Link to="/admin/orders">
                <img src={Orders} alt="" />
                <h3>Orders</h3>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <ul className="sidebar-menu">
            <li className="creature">
              <Link to="/admin/profile">
                <img src={user?.profilepic} alt="" />
                <h3>Profile</h3>
              </Link>
            </li>
            <li className="creature">
              <div className="curd" onClick={handleLogout}>
                <img src={Log} alt="" />
                <h3>Logout</h3>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="toggle-button" onClick={toggleSidebar}>
        <i className="icon">☰</i>
      </div>
    </div>
  );
}
