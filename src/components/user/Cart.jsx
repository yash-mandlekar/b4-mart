import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Truck,
  MapPin,
} from "lucide-react";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../Axios";
import { notify } from "../common/Toast";
import {
  asyncaddcart,
  asyncclearcart,
  asyncremovecart,
} from "../../store/userActions";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const CartBox = ({ data }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(data.count);
    const { product } = data;

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={product?.productpic[0]}
              alt={product?.product_name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-dark mb-1">
              {product?.product_name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {product?.quantity} {product?.quantity_type.toUpperCase()}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">About:</span> {product?.description}
            </p>
            <p className="text-xs text-gray-600 mb-4">
              <span className="font-medium">Cancellation Policy:</span> Orders
              cannot be cancelled once packed for delivery. In case of
              unexpected delays, a refund will be provided, if applicable.
            </p>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {quantity === 0 ? (
                  <button
                    onClick={() => increaseQuantity(product?._id)}
                    className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Item
                  </button>
                ) : (
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => decreaseQuantity(product?._id)}
                      className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                    >
                      <Minus size={16} className="text-gray-600" />
                    </button>
                    <span className="px-4 py-2 font-medium text-dark min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(product?._id)}
                      className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                    >
                      <Plus size={16} className="text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-dark">
                  ₹{product?.price}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [isOpen, setIsOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [total, setTotal] = useState(0);
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
    let count = 0;
    cart.map((e) => {
      count += e.count;
    });
    let tot = 0;
    cart.map((e) => {
      tot += e?.count * e?.product?.price;
    });
    setTotal(tot);
    setCounter(count);
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="text-primary" size={28} />
                <div className="text-3xl font-bold text-dark">
                  Shopping Cart
                </div>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {counter} items
                </span>
              </div>

              <div className="space-y-4">
                {cart.map((e, i) => (
                  <CartBox data={e} key={i} />
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-dark mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Items</span>
                    <span>{counter}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold text-dark">
                    <span>Grand Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={toggleModal}
                  className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Proceed to Checkout
                </button>

                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Truck size={16} />
                    <span className="text-sm font-medium">
                      Free Delivery Available
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Your order qualifies for free delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-dark mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Start shopping to add items to your cart
            </p>
            <button className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Continue Shopping
            </button>
          </div>
        )}

        {/* Checkout Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark">Checkout</h2>
                  <button
                    onClick={toggleModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Address Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="text-primary" size={20} />
                      <h3 className="text-lg font-semibold text-dark">
                        Delivery Address
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="house_no"
                          value={formData.house_no}
                          onChange={handleChange}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors peer"
                          placeholder="House No."
                          required
                        />
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors peer"
                          placeholder="Pincode"
                          pattern="[0-9]{6}"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors peer"
                        placeholder="Street/Area"
                        required
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors peer"
                        placeholder="Landmark"
                        required
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors peer"
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-dark flex items-center gap-2">
                      <CreditCard className="text-primary" size={20} />
                      Payment Method
                    </h3>

                    <div className="space-y-2">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="UPI"
                          checked={paymentMethod === "UPI"}
                          onChange={handlePaymentMethodChange}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-3 text-gray-700">UPI Payment</span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={handlePaymentMethodChange}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-3 text-gray-700">
                          Cash on Delivery
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-dark mb-2">
                      Order Summary
                    </h4>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Items ({counter})</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <hr className="border-gray-200 my-2" />
                    <div className="flex justify-between font-semibold text-dark">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <SideNav />
    </div>
  );
};

export default Cart;
