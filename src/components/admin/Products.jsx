import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import { notify } from "../common/Toast";
import { useDispatch, useSelector } from "react-redux";
import {
  asynallproducts,
  asynccreateproduct,
  asyncremoveproduct,
  asynsingleshopproducts,
} from "../../store/userActions";
import { 
  Plus, 
  Package, 
  Upload, 
  X, 
  Trash2, 
  Eye, 
  Edit,
  Search,
  Filter,
  ChevronDown,
  Camera
} from "lucide-react";

const Products = () => {
  const dispatch = useDispatch();
  const { user, products, singleshop_products } = useSelector(
    (state) => state.user
  );

  // Tab state
  const [activeTab, setActiveTab] = useState('add');

  // Form state
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    description: "",
    price: "",
    stocks: "",
    quantity: "",
    quantity_type: "",
    discount: "",
  });

  // File upload state
  const [firemsg, setfiremsg] = useState();
  const [preview, setpreview] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Product list filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const {
    product_name,
    category,
    description,
    price,
    stocks,
    quantity,
    quantity_type,
    discount,
  } = form;

  const categories = [
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
    "Pet Care"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const uploadFiles = async (event, i) => {
    if (!event.target.files[i]) return;
    if (!["jpg", "jpeg", "png"].includes(event.target.files[i].type.split("/")[1])) {
      return notify("File type is not valid");
    }
    
    try {
      setUploadProgress(true);
      setfiremsg("Uploading...");
      const imageRef = ref(storage, `products/${Date.now()}_${event.target.files[i].name}`);
      await uploadBytes(imageRef, event.target.files[i]);
      const url = await getDownloadURL(imageRef);
      setpreview((prev) => [...prev, url]);
    } catch (err) {
      console.log(err);
      setfiremsg("Upload failed");
      notify("Upload failed. Please try again.");
    } finally {
      setUploadProgress(false);
      setfiremsg("Upload successful!");
      setTimeout(() => {
        setfiremsg("");
      }, 2000);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files.length + preview.length > 5) {
      notify("You can upload only 5 files maximum");
      return;
    }
    
    for (let i = 0; i < event.target.files.length; i++) {
      uploadFiles(event, i);
    }
  };

  const removePreviewImage = (index) => {
    setpreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (preview.length < 1) {
      notify("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", product_name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("quantity_type", quantity_type);
    formData.append("stocks", stocks);
    formData.append("discount", discount || 0);
    formData.append("productpic", preview);

    dispatch(asynccreateproduct(formData));
    
    // Reset form
    setForm({
      product_name: "",
      category: "",
      description: "",
      price: "",
      quantity: "",
      quantity_type: "",
      stocks: "",
      discount: "",
    });
    document.querySelector('input[type="file"]').value = "";
    setpreview([]);
    
    // Switch to products list tab
    setActiveTab('list');
    notify("Product added successfully!");
  };

  // Filter products based on search and category
  const filteredProducts = singleshop_products?.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    dispatch(asynsingleshopproducts(user?._id));
  }, [products]);

  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
        ${activeTab === id 
          ? 'bg-orange-500 text-white shadow-lg' 
          : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
        }
      `}
    >
      <Icon size={20} />
      <span>{label}</span>
      {count !== undefined && (
        <span className={`
          px-2 py-1 rounded-full text-xs font-bold
          ${activeTab === id ? 'bg-white text-orange-500' : 'bg-gray-200 text-gray-600'}
        `}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-gray-600">Manage your product inventory efficiently</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
          <TabButton 
            id="add" 
            label="Add Product" 
            icon={Plus} 
          />
          <TabButton 
            id="list" 
            label="Product List" 
            icon={Package} 
            count={singleshop_products?.length || 0}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Plus className="text-orange-600" size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Add New Product</h2>
            </div>

            <div onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    name="product_name"
                    type="text"
                    placeholder="Enter product name"
                    value={product_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Stocks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    name="stocks"
                    type="number"
                    placeholder="Available stock"
                    value={stocks}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    placeholder="Product quantity"
                    value={quantity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Quantity Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Type *
                  </label>
                  <div className="relative">
                    <select
                      name="quantity_type"
                      value={quantity_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="">Select Type</option>
                      <option value="peice">Piece</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="l">Liters (l)</option>
                      <option value="ml">Millilitre (ml)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your product..."
                  value={description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              {/* Discount */}
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  name="discount"
                  type="number"
                  placeholder="0"
                  value={discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images * (Max 5 images)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <input
                      type="file"
                      name="photo"
                      onChange={handleFileChange}
                      multiple
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Camera size={18} className="mr-2" />
                      Choose Images
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
                  </div>
                </div>

                {/* Upload Status */}
                {firemsg && (
                  <div className={`mt-3 p-3 rounded-lg ${
                    uploadProgress ? 'bg-blue-50 text-blue-600' : 
                    firemsg.includes('successful') ? 'bg-green-50 text-green-600' : 
                    'bg-red-50 text-red-600'
                  }`}>
                    {firemsg}
                  </div>
                )}

                {/* Image Previews */}
                {preview.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Preview Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {preview.map((item, i) => (
                        <div key={i} className="relative group">
                          <img 
                            src={item} 
                            alt={`Preview ${i + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploadProgress}
                  className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {uploadProgress ? 'Processing...' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white rounded-xl shadow-sm">
            {/* List Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Product List</h2>
                    <p className="text-sm text-gray-600">{filteredProducts?.length || 0} products found</p>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full sm:w-64"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer w-full sm:w-48"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts?.map((product, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={product?.productpic}
                          alt={product?.product_name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{product?.product_name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product?.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {product?.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product?.quantity} {product?.quantity_type}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">₹{product?.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product?.stocks > 10 ? 'bg-green-100 text-green-800' :
                          product?.stocks > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product?.stocks} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product?.discount}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => dispatch(asyncremoveproduct(product?._id))}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredProducts?.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || categoryFilter ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first product.'}
                  </p>
                  {!searchTerm && !categoryFilter && (
                    <button
                      onClick={() => setActiveTab('add')}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Add Your First Product
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;