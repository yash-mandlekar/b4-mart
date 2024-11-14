import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { asyncaddcart, asyncremovecart } from "../../store/userActions";

const CartBox = ({ data }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(data.count);
  const { product } = data;
  console.log(data.product.product_name, data.count);

  const increaseQuantity = (id) => {
    dispatch(asyncaddcart(id));

    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = (id) => {
    dispatch(asyncremovecart(id));
    setQuantity((prev) => (prev > 1 ? prev - 1 : 0));
  };
  useEffect(() => {
    setQuantity(data.count);
  }, [data]);
  return (
    <div>
      <div className="line"></div>
      <div className="itemsList">
        <div className="shoppingItemImg">
          <img src={product?.productpic[0]} alt="" />
        </div>
        <div className="shoopingDetails">
          <h3>{product?.product_name}</h3>
          <p>
            {product?.quantity} {product?.quantity_type.toUpperCase()}
          </p>
          <span>In Stock</span>
          <p>
            <b>About this item:</b> {product?.description}
          </p>
          <p>
            <b>Cancellation Policy :</b> Orders cannot be cancelled once packed
            for delivery. In case of unexpected delays, a refund will be
            provided, if applicable.
          </p>
          {/* <Link>Delete this item</Link> */}
          <button type="button" className="button">
            {quantity === 0 ? (
              <span
                className="button__text"
                onClick={() => increaseQuantity(product?._id)}
              >
                Add Item
              </span>
            ) : (
              <div className="button__content">
                <span
                  className="button__icon"
                  onClick={() => decreaseQuantity(product?._id)}
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
                  onClick={() => increaseQuantity(product?._id)}
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
        <div className="productPrice">₹{product?.price}</div>
      </div>
      <div className="line"></div>
    </div>
  );
};

export default CartBox;
