import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../Axios";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config";
import { notify } from "../common/Toast";
import { asyncupdateprofile } from "../../store/userActions";
import imageCompression from "browser-image-compression";
import { User, ShoppingCart, List, Camera } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const fileref = useRef(null);

  const [username, setUsername] = useState(user?.username || "");
  const [house_no, setHouse_no] = useState(user?.house_no || "");
  const [area, setArea] = useState(user?.area || "");
  const [city, setCity] = useState(user?.city || "");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [landmark, setLandmark] = useState(user?.landmark || "");
  const [url, seturl] = useState(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setHouse_no(user.house_no);
      setArea(user.area);
      setCity(user.city);
      setPincode(user.pincode);
      setLandmark(user.landmark);
    }
  }, [user]);
  useEffect(() => {
    if (url) {
      dispatch(asyncupdateprofile(url));
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userSchema = {
      username,
      house_no,
      area,
      city,
      pincode,
      landmark,
    };
    Axios.put("/profileupdate", userSchema)
      .then((response) => {
        if (response.data.user) {
          notify("Profile Updated");
        }
      })
      .catch((error) => {
        console.error("There was an error updating the profile!", error);
      });
  };

  const uploadFile = async (event) => {
    if (!event.target.files[0]) return;
    const file = event.target.files[0];

    if (!["jpg", "jpeg", "png"].includes(file.type.split("/")[1])) {
      return notify("Image type is not valid");
    }

    try {
      notify("Compressing image...");
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      notify("Uploading...");
      const imageRef = ref(storage, `users/${compressedFile.name}`);
      await uploadBytes(imageRef, compressedFile);
      const url = await getDownloadURL(imageRef);
      seturl(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center py-10 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-[#f75c1e]/5 flex flex-col items-center py-10 px-6 gap-8">
          <div className="relative group">
            <img
              src={url ? url : user?.profilepic}
              alt="User"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#f75c1e] shadow-lg cursor-pointer transition hover:scale-105"
              onClick={() => fileref.current.click()}
            />
            <button
              type="button"
              className="absolute bottom-2 right-2 bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-[#f75c1e] hover:text-white transition"
              onClick={() => fileref.current.click()}
              title="Change profile picture"
            >
              <Camera size={18} />
            </button>
            <input
              className="hidden"
              ref={fileref}
              type="file"
              accept="image/*"
              onChange={uploadFile}
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#3f3f3f]">{username}</h3>
            <p className="text-sm text-gray-500">{user?.contact}</p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Link to={"/home/orders"}>
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-[#3f3f3f] hover:bg-[#f75c1e]/10 hover:text-[#f75c1e] font-medium transition">
                <List size={18} />
                Your Orders
              </button>
            </Link>
            <Link to={"/home/cart"}>
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-[#3f3f3f] hover:bg-[#f75c1e]/10 hover:text-[#f75c1e] font-medium transition">
                <ShoppingCart size={18} />
                Your Cart
              </button>
            </Link>
          </div>
        </div>
        {/* Profile Edit Form */}
        <div className="w-full md:w-2/3 py-10 px-6 md:px-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#3f3f3f] mb-6 flex items-center gap-2">
            <User className="text-[#f75c1e]" size={26} />
            Profile Settings
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#3f3f3f] mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#f75c1e] focus:ring-2 focus:ring-[#f75c1e]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3f3f3f] mb-1">
                House No.
              </label>
              <input
                type="text"
                placeholder="House No."
                value={house_no}
                onChange={(e) => setHouse_no(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#f75c1e] focus:ring-2 focus:ring-[#f75c1e]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3f3f3f] mb-1">
                Area
              </label>
              <input
                type="text"
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#f75c1e] focus:ring-2 focus:ring-[#f75c1e]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3f3f3f] mb-1">
                Landmark
              </label>
              <input
                type="text"
                placeholder="Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#f75c1e] focus:ring-2 focus:ring-[#f75c1e]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3f3f3f] mb-1">
                City/Town
              </label>
              <input
                type="text"
                placeholder="City/Town"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#f75c1e] focus:ring-2 focus:ring-[#f75c1e]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3f3f3f] mb-1">
                Pincode
              </label>
              <input
                type="number"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#f75c1e] focus:ring-2 focus:ring-[#f75c1e]/20 transition"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[#f75c1e] hover:bg-[#ff7a3a] text-white font-semibold px-8 py-3 rounded-lg shadow transition-all duration-200 active:scale-95"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
