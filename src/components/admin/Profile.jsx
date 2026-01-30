import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Camera,
  Phone,
  Mail,
  MapPin,
  Home,
  Building,
  Navigation,
  Hash,
  Package,
  ShoppingBag,
  Save,
  Edit3,
} from "lucide-react";

import { asyncupdateprofile, asyncupdateuser } from "../../store/userActions";
import { notify } from "../common/Toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config";
import imageCompression from "browser-image-compression";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const fileref = useRef(null);

  // Form state
  const [username, setUsername] = useState(user?.username || "");
  const [house_no, setHouse_no] = useState(user?.house_no || "");
  const [area, setArea] = useState(user?.area || "");
  const [city, setCity] = useState(user?.city || "");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [landmark, setLandmark] = useState(user?.landmark || "");
  const [contact, setContact] = useState(user?.contact || "");
  const [email, setEmail] = useState(user?.email || "");
  const [url, seturl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update state when user changes
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setHouse_no(user.house_no);
      setArea(user.area);
      setCity(user.city);
      setPincode(user.pincode);
      setLandmark(user.landmark);
      setContact(user.contact);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (url) {
      dispatch(asyncupdateprofile(url));
    }
  }, [url, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const userSchema = {
      username: username,
      house_no: house_no,
      area: area,
      city: city,
      pincode: pincode,
      landmark: landmark,
      contact: contact,
      email: email,
    };

    try {
      await dispatch(asyncupdateuser(userSchema));
      notify("Profile updated successfully!");
    } catch (error) {
      notify("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadFile = async (event) => {
    if (!event.target.files[0]) return;
    const file = event.target.files[0];

    if (!["jpg", "jpeg", "png"].includes(file.type.split("/")[1])) {
      return notify("Image type is not valid");
    }

    try {
      setIsUploading(true);
      notify("Compressing image...");

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      console.log("Compressed File Size:", compressedFile.size / 1024, "KB");

      notify("Uploading...");

      const imageRef = ref(storage, `users/${compressedFile.name}`);
      await uploadBytes(imageRef, compressedFile);
      const downloadUrl = await getDownloadURL(imageRef);

      console.log("url", downloadUrl);
      seturl(downloadUrl);
      notify("Profile picture updated!");
    } catch (err) {
      console.log(err);
      notify("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-32 md:h-40"></div>
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 md:-mt-20">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileref.current.click()}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                  <img
                    src={url || user?.profilepic || "/api/placeholder/160/160"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                <input
                  ref={fileref}
                  type="file"
                  accept="image/*"
                  onChange={uploadFile}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="mt-4 md:mt-0 md:pb-4 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Welcome, {user?.username}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                    <User className="w-4 h-4 mr-1" />
                    {user?.role === "shop" ? "Vendor" : user?.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {user?.products?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Your Products</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {user?.shoporders?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Your Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Profile
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  Personal Information
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={contact}
                      readOnly
                      placeholder="Contact number"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Contact number cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  Address Information
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    House Number
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={house_no}
                      onChange={(e) => setHouse_no(e.target.value)}
                      placeholder="Enter house number"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Area
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Enter area"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Landmark
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Enter landmark"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pin Code
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Pin code"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
