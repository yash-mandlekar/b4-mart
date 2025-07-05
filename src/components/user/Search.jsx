import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Search, X, Zap } from "lucide-react";

const SearchComponent = () => {
  const { singleshop_products } = useSelector((state) => state.user);
  const [products_filtered, setproducts_filtered] =
    useState(singleshop_products);
  const [sname, setSname] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (sname.length > 0) {
      const filtered = singleshop_products.filter((product) => {
        return product.product_name.toLowerCase().includes(sname.toLowerCase());
      });
      setproducts_filtered(filtered);
      setShowSuggestions(true);
    } else {
      setproducts_filtered([]);
      setShowSuggestions(false);
    }
  }, [sname, singleshop_products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearSearch = () => {
    setSname("");
    setShowSuggestions(false);
    setproducts_filtered([]);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (sname.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-orange-50 to-orange-100/50 backdrop-blur-sm border-b border-orange-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative" ref={searchRef}>
          {/* Search Input Container */}
          <div
            className={`relative flex items-center transition-all duration-300 ${
              isSearchFocused
                ? "transform scale-[1.02] shadow-2xl"
                : "shadow-lg hover:shadow-xl"
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search
                className={`h-5 w-5 transition-colors duration-200 ${
                  isSearchFocused ? "text-orange-500" : "text-gray-400"
                }`}
              />
            </div>

            <input
              type="search"
              name="search_product"
              value={sname}
              onChange={(e) => setSname(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder="Search for premium products..."
              className="w-full pl-12 pr-12 py-4 text-lg bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-2xl placeholder-gray-500 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
            />

            {sname && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 max-h-96 overflow-y-auto z-50 animate-slideDown">
              {products_filtered.length > 0 ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-orange-500" />
                      {products_filtered.length} product
                      {products_filtered.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  <div className="py-2">
                    {products_filtered.slice(0, 8).map((data, index) => (
                      <Link
                        key={data._id}
                        to={`/home/${data._id}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 transition-all duration-200 group animate-fadeInUp"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 mr-4">
                          <img
                            src={data?.productpic[0]}
                            alt={data?.product_name}
                            className="w-full h-full object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors duration-200">
                            {data?.product_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {data?.quantity}
                            {data?.quantity_type} • ₹{data?.price}
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Search className="w-3 h-3 text-orange-600" />
                          </div>
                        </div>
                      </Link>
                    ))}

                    {products_filtered.length > 8 && (
                      <div className="px-4 py-3 text-center border-t border-gray-100 bg-gray-50/50">
                        <p className="text-sm text-gray-600">
                          and {products_filtered.length - 8} more product
                          {products_filtered.length - 8 !== 1 ? "s" : ""}...
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : sname.length > 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    No products found
                  </p>
                  <p className="text-xs text-gray-500">
                    Try searching with different keywords
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Popular Searches or Categories (Optional) */}
        {!isSearchFocused && !sname && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Popular:</span>
            {["Organic", "Fresh Fruits", "Vegetables", "Dairy"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSname(tag)}
                className="px-3 py-1 text-xs bg-white/60 hover:bg-white text-gray-700 hover:text-orange-600 rounded-full border border-gray-200/50 hover:border-orange-200 transition-all duration-200 hover:shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default SearchComponent;
