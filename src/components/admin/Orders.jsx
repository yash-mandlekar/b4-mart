import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  User,
  Phone,
  MapPin,
  DollarSign,
  Hash,
  Filter,
  Search,
  ChevronDown,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
} from "lucide-react";
import {
  asyncupdateorderstatus,
  asyncupdateshoporders,
} from "../../store/userActions";

const Orders = () => {
  const { shoporders } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    dispatch(asyncupdateshoporders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(asyncupdateorderstatus(orderId, newStatus));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "placed":
        return <Clock className="w-4 h-4" />;
      case "on the way":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "on the way":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredOrders = shoporders.filter((order) => {
    const matchesSearch =
      order.customer.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer.contact.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Order Management
              </h1>
              <p className="text-gray-600">
                Manage and track all your orders in one place
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <Package className="w-4 h-4" />
                <span className="font-medium">
                  {filteredOrders.length} Orders
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by customer name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="placed">Placed</option>
                <option value="on the way">On The Way</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Shipping Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Hash className="w-4 h-4 text-gray-400" />#{index + 1}
                        </div>
                        <div className="flex items-center gap-2 text-lg font-bold text-orange-600">
                          <DollarSign className="w-4 h-4" />₹{order.totalAmount}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {order.count}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          <User className="w-4 h-4 text-gray-400" />
                          {order.customer.username}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {order.customer.contact}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-0.5">
                          <div>
                            {order.house_no}, {order.area}
                          </div>
                          <div>{order.landmark}</div>
                          <div>
                            {order.city} - {order.pincode}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={order?.product?.productpic[0]}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="w-4 h-4 text-gray-400" />
                          Product
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {order.orderStatus === "cancelled" ? (
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          Cancelled
                        </div>
                      ) : (
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white cursor-pointer"
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
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredOrders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Hash className="w-4 h-4 text-gray-400" />
                    Order #{index + 1}
                  </div>
                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order._id ? null : order._id,
                      )
                    }
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {expandedOrder === order._id ? "Less" : "More"}
                  </button>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {order.customer.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.customer.contact}
                  </div>
                </div>

                {/* Amount and Quantity */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xl font-bold text-orange-600">
                    <DollarSign className="w-5 h-5" />₹{order.totalAmount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Qty: {order.count}
                  </div>
                </div>

                {/* Product Image */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={order?.product?.productpic[0]}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-gray-400" />
                    Product Details
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  {order.orderStatus === "cancelled" ? (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      Cancelled
                    </div>
                  ) : (
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="placed">Placed</option>
                      <option value="on the way">On The Way</option>
                      <option value="delivered">Delivered</option>
                      <option value="not available">Not Available</option>
                    </select>
                  )}
                </div>

                {/* Expandable Address */}
                {expandedOrder === order._id && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          Shipping Address:
                        </div>
                        <div>
                          {order.house_no}, {order.area}
                        </div>
                        <div>{order.landmark}</div>
                        <div>
                          {order.city} - {order.pincode}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Orders will appear here once customers start placing them"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
