import React, { useEffect, useState } from "react";
import SideNav from "./SideNav";
import "../../Css/ShoppingCart.css";
import CartBox from "./CartBox";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../Axios";
import { notify } from "../common/Toast";
import { asyncclearcart } from "../../store/userActions";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [counter, setcounter] = useState(0);
  const [total, settotal] = useState(0);
  const { cart, user } = useSelector((state) => state.user);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const [formData, setFormData] = useState({
    pincode: user?.pincode,
    house_no: user?.house_no,
    area: user?.area,
    landmark: user?.landmark,
    city: user?.city,
    defaultAddress: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === "COD") {
      try {
        await Axios.post("/create_order", {
          ...formData,
          paymentMethod: "COD",
        });
        notify("Order placed successfully. Cash on delivery.");
        dispatch(asyncclearcart());
        setIsOpen(false);
        setTimeout(() => {
          navigate("/home/orders");
        }, 30);
      } catch (error) {
        console.error("Error placing COD order:", error);
        alert("Order placement failed. Please try again.");
      }
    } else {
      try {
        const { data } = await Axios.get("/payment_gateway");
        const options = {
          key: "rzp_test_LQzqvbK2cWMGRg", // Replace with your Razorpay Key ID
          amount: data?.amount * 100, // Convert to paise
          currency: "INR",
          name: "B4 Mart",
          description: "Test Transaction",
          order_id: data?.id,
          image:
            "https://b4mart.com/static/media/B4mart.3c7b651ef058639fabff.png",
          handler: async function (response) {
            await Axios.post("/create_order", {
              ...formData,
              paymentMethod: "UPI",
            });
            notify(`Payment Successful`);
            dispatch(asyncclearcart());
            setIsOpen(false);
            navigate("/home/orders");
          },
          prefill: {
            email: "test@example.com", // Optional
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Payment failed:", error);
        alert("Payment failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    var count = 0;
    cart.map((e) => {
      count += e.count;
    });
    var tot = 0;
    cart.map((e) => {
      tot += e?.count * e?.product?.price;
    });
    settotal(tot);
    setcounter(count);
  }, [cart]);

  return (
    <div>
      <div className="shoppingCart">
        {cart.length > 0 ? (
          <div className="longBox">
            <div className="fixedBox">
              <h1>Cart List</h1>
            </div>
            <h1 className="ini">Cart List</h1>

            {cart.map((e, i) => (
              <CartBox data={e} key={i} />
            ))}
            <div className="billContainer">
              <h1>Bill Details</h1>
              <p>Total Items : {counter}</p>
              <div className="payrap">
                <h2>
                  Grand total(1 item) : <span>₹ {total}</span>
                </h2>
                <button className=" buttu" onClick={toggleModal}>
                  Procced to pay
                </button>
                {isOpen && (
                  <div className="popup-modal__overlay">
                    <div className="popup-modal__content">
                      <h2>Add Address</h2>
                      <button
                        className="popup-modal__close-btn"
                        onClick={toggleModal}
                      >
                        &times;
                      </button>

                      <div className="address-form-container">
                        <form className="address-form" onSubmit={handleSubmit}>
                          {/* House Details */}
                          <div className="user-box">
                            <input
                              type="text"
                              name="house_no"
                              value={formData.house_no}
                              onChange={handleChange}
                              className="address-form__input"
                              required
                            />
                            <label>House no.</label>
                          </div>

                          {/* Area Details */}
                          <div className="user-box">
                            <input
                              type="text"
                              name="area"
                              value={formData.area}
                              onChange={handleChange}
                              className="address-form__input"
                              required
                            />
                            <label className="address-form__label">
                              Street
                            </label>
                          </div>

                          {/* Landmark */}
                          <div className="user-box">
                            <input
                              type="text"
                              name="landmark"
                              value={formData.landmark}
                              onChange={handleChange}
                              className="address-form__input"
                              required
                            />
                            <label className="address-form__label">
                              Landmark
                            </label>
                          </div>

                          {/* City */}
                          <div className="user-box">
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="address-form__input"
                              required
                            />
                            <label className="address-form__label">City</label>
                          </div>

                          {/* Pincode */}
                          <div className="user-box">
                            <input
                              type="text"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleChange}
                              className="address-form__input"
                              pattern="[0-9]{6}"
                              required
                            />
                            <label className="address-form__label">
                              Pincode
                            </label>
                          </div>

                          {/* Payment Method Selection */}
                          <div className="body">
                            <div className="tabs">
                              <input
                                checked={paymentMethod === "UPI"}
                                onChange={handlePaymentMethodChange}
                                value="UPI"
                                name="fav_language"
                                id="UPI"
                                type="radio"
                                className="input"
                              />
                              <label htmlFor="UPI" className="label">
                                UPI Payment
                              </label>

                              <input
                                checked={paymentMethod === "COD"}
                                onChange={handlePaymentMethodChange}
                                value="COD"
                                name="fav_language"
                                id="COD"
                                type="radio"
                                className="input"
                              />
                              <label htmlFor="COD" className="label">
                                Cash On Delivery
                              </label>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            className="address-form__submit-btn"
                          >
                            Checkout
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="longBox">
            <h1>No Items in Cart</h1>
          </div>
        )}
      </div>
      <SideNav />
    </div>
  );
};

export default Cart;
