import React from "react";

import { Link } from "react-router-dom";
const Shops = ({ data }) => {
  console.log();

  return (
    <>
      <Link to={`shop-products/${data._id}`} className="shoperBox">
        <div className="top">
          <img
            src={
              data.profilepic.toLowerCase().includes("default.png")
                ? "https://www.shutterstock.com/image-vector/shop-logo-good-260nw-1290022027.jpg"
                : data.profilepic
            }
          />
        </div>
        <div className="name">{data.username}</div>
      </Link>
    </>
  );
};

export default Shops;
