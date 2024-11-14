import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Charts from "../common/BarChart";
const AdminDashboard = () => {
  const { role, page_loading } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!page_loading) {
      if (role == "admin" || role == "shop") {
      } else {
        navigate("/admin-login");
      }
    }
  }, [page_loading]);

  return (
    <div className="dashboard-cnt">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
