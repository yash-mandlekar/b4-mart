import React, { useEffect, useState } from "react";
import "../../Css/UserSearch.css";
import { Link } from "react-router-dom";
import Axios from "../../Axios";
import Product from "./Product";
const UserSearch = ({ pname }) => {
  const [products, setproducts] = useState(null);
  useEffect(() => {
    if (pname) {
      handleSearch(pname);
    }
  }, [pname]);

  const handleSearch = async (pname) => {
    try {
      const response = await Axios.get(`/product/${pname}`);
      console.log(response.data);

      setproducts(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="userSearchDiv">
      {products && products.map((e, i) => <Product data={e} />)}
    </div>
  );
};

export default UserSearch;
