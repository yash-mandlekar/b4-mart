import React, { useEffect, useState } from "react";
import "../../Css/Dashboard.css";
import BarChart from "../common/BarChart";
import PieChart from "../common/PieChart";
import Axios from "../../Axios";
import { useDispatch, useSelector } from "react-redux";
import { asynsingleshopproducts } from "../../store/userActions";
const Dashboard = () => {
  const [series, setSeries] = useState([]);
  const [month, setMonth] = useState([]);

  const [label, setLabel] = useState([
    "Paan Corner",
    "Dairy, Bread & Eggs",
    "Fruits & Vegetables",
    "Cold Drinks & Juices",
    "Snacks & Munchies",
    "Breakfast & Instant Food",
    "Sweet Tooth",
    "Bakery",
    "Tea, Coffee & Health Drink",
    "Atta, Rice & Dal",
    "Masala, Oil & More",
    "Sauces & Spreads",
    "Chicken, Meat & Fish",
    "Organic & Healthy Living",
    "Baby Care",
    "Pharma & Wellness",
    "Cleaning Essentials",
    "Home & Office",
    "Personal Care",
    "Pet Care",
  ]);
  const [pieseries, setPieseries] = useState();
  const dispatch = useDispatch();
  const { singleshop_products, user } = useSelector((state) => state.user);

  const fetchData = async () => {
    try {
      const { data } = await Axios.get("/admin/dateorders");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Transform the input data into the desired format
      const ser = data?.map((item) => item.count);
      const categories = data?.map((item) => monthNames[item.month - 1]);
      setSeries(ser);
      setMonth(categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      dispatch(asynsingleshopproducts(user?._id));
    }
  }, []);

  useEffect(() => {
    if (singleshop_products.length) {
      const categoryCounts = new Array(label.length).fill(0);

      // Iterate over products and increment the count for the corresponding category
      singleshop_products.forEach((product) => {
        const categoryIndex = label.indexOf(product.category);
        if (categoryIndex !== -1) {
          categoryCounts[categoryIndex]++;
        }
      });

      setPieseries(categoryCounts);
    }
  }, [singleshop_products]);

  return (
    <div className="dash">
      {pieseries?.length > 0 && (
        <PieChart label={label} pieseries={pieseries} />
      )}
      {series?.length > 0 && <BarChart data={series} categories={month} />}
      {series?.length === 0 && <h1>No data to display</h1>}
    </div>
  );
};

export default Dashboard;
