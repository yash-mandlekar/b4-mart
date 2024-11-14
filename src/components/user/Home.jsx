import React, { useEffect, useState } from "react";
import "../../Css/Home.css";
import SideNav from "./SideNav";
import Overlay from "../common/Overlay";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../common/Logo";
import Notification from "../../assets/notification.svg";
import Logout from "../../assets/logout.svg";
import cartlogo from "../../assets/cart.svg";
import { NavLink, Link } from "react-router-dom";
import { asynclogout } from "../../store/userActions";

const Home = () => {
  const navigate = useNavigate();

  const { isLoggedIn, location } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(0);
  const { cart, user, singleshop_products } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    let count = 0;
    cart.forEach((item) => {
      count += item.count;
    });
    setCounter(count);
  }, [cart]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(asynclogout());
    }
  };

  return (
    <div className="main">
      {!location?.latitude && <Overlay />}
      <div className="top-nav">
        <Logo />
        <div className="nav-items">
          <button onClick={handleLogout} className="logout">
            <img className="top-nav-img" src={Logout} alt="" />
          </button>
          <NavLink to="/home/orders" className="top-nav-item">
            <img className="top-nav-img" src={Notification} alt="" />
          </NavLink>
          <NavLink to="cart" id="cartOption" className="top-nav-item">
            {counter > 0 && <div className="circ">{counter}</div>}
            <img className="top-nav-img" src={cartlogo} alt="" />
          </NavLink>
          <Link to="/home/profile" className="top-nav-profile-cnt">
            <img className="top-nav-profile" src={user?.profilepic} alt="" />
          </Link>
        </div>
      </div>
      {/* {route.pathname.match("/home") && <Search setPname={setPname} />} */}

      <div className="content-area">
        <Outlet />
      </div>
      <SideNav />
    </div>
  );
};

export default Home;
