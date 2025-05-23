import React, { useEffect } from "react";
import "../../Css/UserOrder.css";
import { useDispatch, useSelector } from "react-redux";
import { asyncupdateorders, cancelOrderAction } from "../../store/userActions";

const UserOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(asyncupdateorders());
  }, [dispatch]);

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrderAction(orderId));
    }
  };

  return (
    <div className="order-page">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {loading ? (
          <div className="card">
            <div className="card__skeleton card__title"></div>
            <div className="card__skeleton card__description"> </div>
            <div className="card__skeleton card__description"> </div>
          </div>
        ) : (
          orders?.map((order) => (
            <div className="order-card" key={order?._id}>
              <div key={order?.product?._id} className="order-item">
                <img
                  src={order?.product.productpic[0]}
                  alt={order?.product.product_name}
                  className="order-image"
                />
                <div className="order-details">
                  <h2>{order.product.product_name}</h2>
                  <p>
                    <b>Price:</b> ₹{order.product.price}
                  </p>
                  <p>
                    <b>Quantity:</b> {order.count}
                  </p>
                  <p>
                    <b>Status:</b> <strong>{order.orderStatus}</strong>
                  </p>
                  {order.orderStatus == "cancelled" ? (
                    <button className="cancelled">Cancelled Order</button>
                  ) : order.orderStatus == "placed" ? (
                    <button
                      className="track-button"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  ) : (
                    // on the way
                    <button className="on-the-way">
                      <i className="fa-solid fa-truck-fast"></i> On the way
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
