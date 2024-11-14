import React from "react";
import "../../Css/Home.css";
import { Link } from "react-router-dom";
import Logos from "../../Images/B4mart.png"
const Logo = () => {
  return (
    <Link to="/home" className="monty" activeclassname="active">
      <div className="logo">
        <img
          src={Logos}
          alt=""
        />
      </div>
    </Link>
  );
};

export default Logo;
