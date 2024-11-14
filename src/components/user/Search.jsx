import React, { useEffect, useRef, useState } from "react";
import "../../Css/Home.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Search = () => {
  const { singleshop_products } = useSelector((state) => state.user);
  useRef();
  const [products_filtered, setproducts_filtered] =
    useState(singleshop_products);
  const [sname, setSname] = useState("");
  useEffect(() => {
    if (sname.length > 2) {
      setproducts_filtered(
        singleshop_products.filter((product) => {
          return product.product_name
            .toLowerCase()
            .includes(sname.toLowerCase());
        })
      );
    } else {
      setproducts_filtered(singleshop_products);
    }
  }, [sname, singleshop_products]);
  return (
    <nav className="searchBox">
      <div className="search-div">
        <input
          className="search"
          type="search"
          name="search_product"
          onChange={(e) => setSname(e.target.value)}
          value={sname}
          placeholder="Search any items.."
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
        <div className="suggestion-box">
          {products_filtered.map((data) => (
            <Link to={`/home/${data._id}`} className="suggestion">
              <div className="img">
                <img src={data?.productpic[0]} alt="" />
              </div>
              <div className="suggestion-title">
                {data?.product_name} &nbsp;
              </div>
              <div className="suggestion-quantity">
                {data?.quantity}
                {data?.quantity_type}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Search;
