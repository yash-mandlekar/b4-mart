import React, { useState, useEffect, useRef } from "react";
import "../../Css/UserProfile.css";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../Axios";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config";
import { notify } from "../common/Toast";
import { asyncupdateprofile } from "../../store/userActions";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const fileref = useRef(null);
  // Use state for form inputs, initialized with existing user data
  const [username, setUsername] = useState(user?.username || "");
  const [house_no, setHouse_no] = useState(user?.house_no || "");
  const [area, setArea] = useState(user?.area || "");
  const [city, setCity] = useState(user?.city || "");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [landmark, setLandmark] = useState(user?.landmark || "");

  const [url, seturl] = useState(null);

  // Update state when user changes
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
      username: username,
      house_no: house_no,
      area: area,
      city: city,
      pincode: pincode,
      landmark: landmark,
    };
    // Send POST request to the server
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
    if (
      !["jpg", "jpeg", "png"].includes(event.target.files[0].type.split("/")[1])
    )
      return notify("image type is not valid");

    try {
      notify("Uploading...");
      const imageRef = ref(storage, `users/${event.target.files[0].name}`);
      await uploadBytes(imageRef, event.target.files[0]);
      const url = await getDownloadURL(imageRef);
      seturl(url);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="userprofile">
      <div className="profile-edit-container">
        {/* Left Sidebar */}
        <div className="profile-edit-sidebar">
          <div className="profile-edit-details">
            <img
              src={url ? url : user?.profilepic}
              alt="User"
              className="profile-edit-image"
              onClick={() => fileref.current.click()}
            />
            <input
              className="profile-pic-input"
              ref={fileref}
              type="file"
              accept="image/*"
              onChange={uploadFile}
            />

            <h3 className="profile-edit-username">{username}</h3>
            <p className="profile-edit-email">{user?.contact}</p>
          </div>
          <div className="profile-edit-menu">
            <Link to={"/home/orders"}>
              <button className="profile-edit-menu-button">Your Orders</button>
            </Link>
            <Link to={"/home/cart"}>
              <button className="profile-edit-menu-button">Your Cart</button>
            </Link>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="profile-edit-form">
          <h2>Profile Settings</h2>
          <form onSubmit={handleSubmit}>
            <div className="profile-edit-form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="profile-edit-form-group">
              <label>House No.</label>
              <input
                type="text"
                placeholder="House No."
                defaultValue={house_no}
                onChange={(e) => setHouse_no(e.target.value)}
              />
            </div>
            <div className="profile-edit-form-group">
              <label>Area</label>
              <input
                type="text"
                placeholder="Area"
                defaultValue={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="profile-edit-form-group">
              <label>Landmark</label>
              <input
                type="text"
                placeholder="Landmark"
                defaultValue={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>
            <div className="profile-edit-form-group">
              <label>City/Town</label>
              <input
                type="text"
                placeholder="State/Region"
                defaultValue={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="profile-edit-form-group">
              <label>Pincode</label>
              <input
                type="number"
                placeholder="Pincode"
                defaultValue={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div className="profile-edit-form-group">
              <button type="submit" className="profile-edit-save-button">
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
