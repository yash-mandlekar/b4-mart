import React, { useState, useEffect } from "react";
import "../../Css/OrderList.css";
import Axios from "../../Axios";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncupdateorderstatus,
  asyncupdateshoporders,
} from "../../store/userActions";

const Orders = () => {
  const { shoporders } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    dispatch(asyncupdateshoporders());
  }, []);

  const handleChange = (e) => {
    dispatch(asyncupdateorderstatus(e.target.id, e.target.value));
  };

  return (
    <div className="coverOrder">
      <div className="order-list-container">
        <h2 className="order-list-title">Order Management</h2>
        <table className="order-list-table">
          <thead>
            <tr>
              <th>Sno.</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Shipping Address</th>
              <th>Amount</th>
              <th>Product</th>
              <th>Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shoporders.map((order, i) => (
              <tr key={order._id}>
                <td>{i + 1}</td>
                <td>{order.customer.username}</td>
                <td>{order.customer.contact}</td>
                <td>
                  <p>{order.house_no}</p>
                  <p>{order.area}</p>
                  <p>{order.landmark}</p>
                  <p>{order.city}</p>
                  <p>{order.pincode}</p>
                </td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <div className="order-img">
                    <img src={order?.product?.productpic[0]} alt="" />
                  </div>
                </td>
                <td>{order.count}</td>
                <td>
                  {order.orderStatus === "cancelled" ? (
                    <p className="cancelled">Cancelled</p>
                  ) : (
                    <select
                      id={order?._id}
                      className="status-select"
                      onChange={handleChange}
                      defaultValue={order.orderStatus}
                    >
                      <option value="placed">Placed</option>
                      <option value="on the way">On The Way</option>
                      <option value="delivered">Delivered</option>
                      <option value="not available">Not Available</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className="pagination">
          Showing 1-{orders.length} of {orders.length}
        </div> */}
      </div>
    </div>
  );
};

export default Orders;
