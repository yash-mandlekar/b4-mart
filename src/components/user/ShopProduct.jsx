import { useEffect, useState } from "react";
import { Search, Grid, List, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncaddcart,
  asyncremovecart,
  asynsingleshopproducts,
} from "../../store/userActions";
import { useNavigate, useParams } from "react-router-dom";
import SearchComponent from "./Search";
// const SearchComponent = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   return (
//     <div className="bg-white shadow-sm border-b sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//           {/* Search Bar */}
//           <div className="relative flex-1 max-w-lg">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
//             />
//           </div>

//           {/* Filter and Sort Controls */}
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//               className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <Filter className="w-4 h-4" />
//               <span className="text-sm font-medium">Filter</span>
//             </button>
//             <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//               <ArrowUpDown className="w-4 h-4" />
//               <span className="text-sm font-medium">Sort</span>
//             </button>
//           </div>
//         </div>

//         {/* Filter Panel */}
//         {isFilterOpen && (
//           <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category
//                 </label>
//                 <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
//                   <option>All Categories</option>
//                   <option>Grains & Cereals</option>
//                   <option>Nuts & Dry Fruits</option>
//                   <option>Oils & Vinegars</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Price Range
//                 </label>
//                 <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
//                   <option>All Prices</option>
//                   <option>Under ₹500</option>
//                   <option>₹500 - ₹1000</option>
//                   <option>Above ₹1000</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Brand
//                 </label>
//                 <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
//                   <option>All Brands</option>
//                   <option>Organic Valley</option>
//                   <option>Premium Choice</option>
//                   <option>Natural Best</option>
//                 </select>
//               </div>
//               <div className="flex items-end">
//                 <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
const ShopProduct = () => {
  // Mock data - replace with your actual useParams and useSelector
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleshop_products } = useSelector((state) => state.user);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState({});
  // Mock useEffect - replace with your actual dispatch call
  useEffect(() => {
    if (id) {
      dispatch(asynsingleshopproducts(id));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (id) {
      setLoading(true);
      // dispatch(asynsingleshopproducts(id));
      setTimeout(() => setLoading(false), 1000); // Mock loading
    }
  }, [id]);
  const increaseQuantity = (productId) => {
    dispatch(asyncaddcart(productId));
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  // Mock function - replace with your actual cart action
  const decreaseQuantity = (productId) => {
    dispatch(asyncremovecart(productId));
    setCartItems((prev) => {
      const currentCount = prev[productId] || 0;
      if (currentCount <= 1) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [productId]: currentCount - 1,
      };
    });
  };
  const getCartCount = (productId) => {
    return cartItems[productId] || 0;
  };
  const ProductCard = ({ product, index }) => {
    const count = getCartCount(product._id);

    const handleCardClick = (e) => {
      // Don't navigate if clicking on cart buttons
      if (e.target.closest(".cart-controls")) {
        return;
      }
      navigate(`/home/${product._id}`);
    };

    return (
      <div
        key={product._id}
        className=""
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
          {/* Product Image */}
          <div
            className="aspect-square bg-gray-100 rounded-t-2xl overflow-hidden cursor-pointer group"
            onClick={handleCardClick}
          >
            <img
              src={product.productpic[0]}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Details */}
          <div className="p-4">
            <div className="cursor-pointer" onClick={handleCardClick}>
              <h3 className="font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors duration-200">
                {product.product_name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {product.quantity}
                {product.quantity_type}
              </p>
              <div className="font-bold text-gray-900 mb-4">
                ₹{product.price}
              </div>
            </div>

            {/* Add to Cart Controls */}
            <div className="cart-controls">
              {count === 0 ? (
                <button
                  onClick={() => increaseQuantity(product._id)}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <div className="flex items-center justify-between bg-orange-50 rounded-xl p-2 border-2 border-orange-200">
                  <button
                    onClick={() => decreaseQuantity(product._id)}
                    className="w-10 h-10 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center text-orange-600 hover:bg-orange-100 active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 text-center">
                    <span className="font-semibold text-orange-700 text-lg">
                      {count}
                    </span>
                    <p className="text-xs text-orange-600 mt-1">in cart</p>
                  </div>

                  <button
                    onClick={() => increaseQuantity(product._id)}
                    className="w-10 h-10 rounded-lg bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center text-white active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchComponent />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Premium Products
            </h1>
            <p className="text-gray-600">
              Discover our curated collection of {singleshop_products.length}{" "}
              premium products
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {singleshop_products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && singleshop_products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Load More Button */}
        {/* {!loading && singleshop_products.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Load More Products
            </button>
          </div>
        )} */}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShopProduct;
