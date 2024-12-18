import React from "react";
import "../../Css/Home.css";

const Shopsearch = ({ setSname, sname }) => {
  return (
    <nav className="searchBox">
      <div className="search-div">
        <input
          className="search"
          type="search"
          name="search_product"
          onChange={(e) => setSname(e.target.value)}
          value={sname}
          placeholder="Search Shops..."
        />
        <div className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon"
            viewBox="0 0 512 512"
          >
            <path
              d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="32"
            ></path>
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="32"
              d="M338.29 338.29L448 448"
            ></path>
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Shopsearch;
