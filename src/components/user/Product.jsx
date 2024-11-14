import React, { useEffect, useState } from "react";
import "../../Css/product.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncaddcart, asyncremovecart } from "../../store/userActions";
const Product = ({ data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(0);

  const increaseQuantity = (id) => {
    dispatch(asyncaddcart(id));
    if (quantity > 19) return;
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = (id) => {
    dispatch(asyncremovecart(id));
    setQuantity((prev) => (prev > 1 ? prev - 1 : 0));
  };

  useEffect(() => {
    var a = cart.filter((e) => {
      return e?.product?._id == data?._id;
    });
    if (a[0]) {
      setQuantity(a[0]?.count);
    }
  }, []);

  return (
    <>
      <div className="productBox">
        <Link to={`/home/${data?._id}`}>
          <div className="image">
            <img src={data?.productpic[0]} alt="" />
          </div>
        </Link>
        <div className="content">
          <Link to={`/home/${data?._id}`}>
            <div className="name boxi">
              <p>{data?.product_name} </p>
            </div>
          </Link>
          <div className="quantity boxi">
            {data?.quantity} {data?.quantity_type}
          </div>
          <div className="overlap">
            <div className="price "> ₹ {data?.price}</div>
            <div className="add ">
              <button type="button" className="button">
                {quantity === 0 ? (
                  <span
                    className="button__text"
                    onClick={() => increaseQuantity(data?._id)}
                  >
                    Add Item
                  </span>
                ) : (
                  <div className="button__content">
                    <span
                      className="button__icon"
                      onClick={() => decreaseQuantity(data?._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke="currentColor"
                        height="24"
                        fill="none"
                        className="svg"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                    <span className="button__text">{quantity}</span>
                    <span
                      className="button__icon"
                      onClick={() => increaseQuantity(data?._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke="currentColor"
                        height="24"
                        fill="none"
                        className="svg"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
