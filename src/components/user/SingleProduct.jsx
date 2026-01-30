import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Axios from "../../Axios";
import { asyncaddcart, asyncremovecart } from "../../store/userActions";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.user);
  const [singleProduct, setSingleProduct] = useState(null);
  const [count, setCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("description");

  const getProduct = useCallback(
    async (productId) => {
      try {
        const { data } = await Axios.get(`/singleproduct/${productId}`);
        setSingleProduct(data.data);
        console.log(cart);
        var a = cart?.filter((e) => {
          return e.product._id === data.data._id;
        });
        if (a[0]) {
          setCount(a[0]?.count);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [cart],
  );

  const navigateImage = (direction) => {
    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === singleProduct?.productpic?.length - 1 ? 0 : prev + 1,
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? singleProduct?.productpic?.length - 1 : prev - 1,
      );
    }
  };

  const increaseQuantity = (id) => {
    dispatch(asyncaddcart(id));
    setCount((prev) => prev + 1);
  };

  const decreaseQuantity = (id) => {
    dispatch(asyncremovecart(id));
    setCount((prev) => (prev > 1 ? prev - 1 : 0));
  };

  const addToWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: singleProduct?.product_name,
        text: singleProduct?.description,
        url: window.location.href,
      });
    }
  };

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id, getProduct]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <Link to="/products" className="text-sm">
                <span className="font-medium">Back to Products</span>
              </Link>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={shareProduct}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group">
              <img
                src={singleProduct?.productpic?.[currentImageIndex]}
                alt={singleProduct?.product_name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Navigation Arrows */}
              {singleProduct?.productpic?.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => navigateImage("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 rotate-180"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {singleProduct?.productpic?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {singleProduct.productpic.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={addToWishlist}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                  isWishlisted
                    ? "bg-red-500 text-white scale-110"
                    : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-110"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {singleProduct?.productpic?.length > 1 && (
              <div className="flex space-x-3">
                {singleProduct.productpic.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex
                        ? "border-orange-500 scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${singleProduct.product_name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {singleProduct?.product_name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    (4.8) • 324 reviews
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-600">
                {singleProduct?.quantity}
                {singleProduct?.quantity_type}
              </p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{singleProduct?.price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ₹{Math.round(singleProduct?.price * 1.2)}
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                  17% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => decreaseQuantity(singleProduct?._id)}
                    disabled={count === 0}
                    className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg min-w-[60px] text-center">
                    {count}
                  </span>
                  <button
                    onClick={() => increaseQuantity(singleProduct?._id)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {count > 0 && (
                  <div className="text-sm text-gray-600">
                    Total:{" "}
                    <span className="font-semibold text-gray-900">
                      ₹{singleProduct?.price * count}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() =>
                count === 0 ? increaseQuantity(singleProduct?._id) : null
              }
              disabled={count > 0}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                count === 0
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-green-100 text-green-700 cursor-default border-2 border-green-200"
              }`}
            >
              {count === 0 ? (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              ) : (
                <>
                  <span>✓ Added to Cart</span>
                </>
              )}
            </button>

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Free Delivery
                </p>
                <p className="text-xs text-gray-600">Above ₹499</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Quality Assured
                </p>
                <p className="text-xs text-gray-600">100% Organic</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-600">7-day policy</p>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-8 border-b border-gray-200">
                {["description", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                      selectedTab === tab
                        ? "text-orange-600 border-b-2 border-orange-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {selectedTab === "description" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Product Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {singleProduct?.description}
                    </p>
                  </div>
                )}
                {selectedTab === "specifications" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">
                          Weight:
                        </span>
                        <span className="text-gray-700 ml-2">
                          {singleProduct?.quantity}
                          {singleProduct?.quantity_type}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Origin:
                        </span>
                        <span className="text-gray-700 ml-2">
                          Kashmir, India
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Type:</span>
                        <span className="text-gray-700 ml-2">Organic</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Shelf Life:
                        </span>
                        <span className="text-gray-700 ml-2">12 months</span>
                      </div>
                    </div>
                  </div>
                )}
                {selectedTab === "reviews" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Customer Reviews
                    </h4>
                    <div className="space-y-4">
                      {[1, 2, 3].map((review) => (
                        <div
                          key={review}
                          className="border-b border-gray-100 pb-4"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              Verified Purchase
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">
                            Excellent quality almonds! Very fresh and crunchy.
                            Perfect for my morning smoothies.
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            - Customer {review}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
