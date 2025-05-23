import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  Store,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import BarChart from "../common/BarChart";
import PieChart from "../common/PieChart";
import Axios from "../../Axios";
import { asynsingleshopproducts } from "../../store/userActions";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [series, setSeries] = useState([]);
  const [month, setMonth] = useState([]);
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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
  const { singleshop_products, user, role } = useSelector(
    (state) => state.user
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
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

      // Calculate growth (comparing last two months)
      const growth =
        ser.length >= 2
          ? (
              ((ser[ser.length - 1] - ser[ser.length - 2]) /
                ser[ser.length - 2]) *
              100
            ).toFixed(1)
          : 0;

      // Mock additional stats - replace with real API calls
      setStatsData({
        totalOrders: ser.reduce((a, b) => a + b, 0),
        totalProducts: singleshop_products?.length || 0,
        totalUsers: 1250, // Replace with real data
        totalRevenue: 45680, // Replace with real data
        monthlyGrowth: growth,
      });

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
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

      singleshop_products.forEach((product) => {
        const categoryIndex = label.indexOf(product.category);
        if (categoryIndex !== -1) {
          categoryCounts[categoryIndex]++;
        }
      });

      setPieseries(categoryCounts);
      setStatsData((prev) => ({
        ...prev,
        totalProducts: singleshop_products.length,
      }));
    }
  }, [singleshop_products]);

  // Stats cards configuration
  const statsCards = [
    {
      title: "Total Orders",
      value: statsData.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
      change: statsData.monthlyGrowth,
      changeType: statsData.monthlyGrowth >= 0 ? "increase" : "decrease",
    },
    {
      title: "Products",
      value: statsData.totalProducts,
      icon: Package,
      color: "bg-primary",
      change: "12.5",
      changeType: "increase",
    },
    ...(role === "admin"
      ? [
          {
            title: "Total Users",
            value: statsData.totalUsers,
            icon: Users,
            color: "bg-green-500",
            change: "8.2",
            changeType: "increase",
          },
          {
            title: "Revenue",
            value: `₹${statsData.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "bg-purple-500",
            change: "15.3",
            changeType: "increase",
          },
        ]
      : []),
  ];

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm h-96">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm h-96">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-500">Welcome back,</span>
                <p className="font-semibold text-gray-900">
                  {user?.name || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {card.changeType === "increase" ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        card.changeType === "increase"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {card.change}%
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {typeof card.value === "number" && card.value > 999
                      ? card.value.toLocaleString()
                      : card.value}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        {series?.length > 0 || pieseries?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            {series?.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Monthly Orders
                    </h3>
                    <p className="text-sm text-gray-600">
                      Orders trend over the last {month.length} months
                    </p>
                  </div>
                </div>
                <div className="h-80">
                  <BarChart data={series} categories={month} />
                </div>
              </div>
            )}

            {/* Pie Chart */}
            {pieseries?.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-primary bg-opacity-10 rounded-lg mr-3">
                    <PieChartIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Products by Category
                    </h3>
                    <p className="text-sm text-gray-600">
                      Distribution of {statsData.totalProducts} products
                    </p>
                  </div>
                </div>
                <div className="h-80">
                  <PieChart label={label} pieseries={pieseries} />
                </div>
              </div>
            )}
          </div>
        ) : (
          // No Data State
          <div className="bg-white rounded-lg p-12 shadow-sm text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600 mb-6">
              There's no data to display at the moment. Start by adding some
              products or wait for orders to come in.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/admin/products">
                <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Add Products
                </button>
              </Link>

              <a href="/admin">
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Refresh Data
                </button>
              </a>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-orange-50 transition-colors">
              <Package className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Add Product
              </span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-orange-50 transition-colors">
              <ShoppingCart className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-700">
                View Orders
              </span>
            </button>
            {role === "admin" && (
              <>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-orange-50 transition-colors">
                  <Store className="w-6 h-6 text-primary mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Manage Shops
                  </span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-orange-50 transition-colors">
                  <Users className="w-6 h-6 text-primary mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    View Users
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
