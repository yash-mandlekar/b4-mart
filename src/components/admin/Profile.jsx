import React, { useEffect, useRef, useState } from "react";
import "../../Css/AdminProfile.css";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../../Axios";
import { asyncupdateprofile, asyncupdateuser } from "../../store/userActions";
import { notify } from "../common/Toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config";
import imageCompression from "browser-image-compression";

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
  const [contact, setContact] = useState(user?.contact || "");
  const [email, setEmail] = useState(user?.email || "");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    dispatch(asyncupdateuser(userSchema));
  };
  const uploadFile = async (event) => {
    if (!event.target.files[0]) return;
    const file = event.target.files[0];
  
    if (!["jpg", "jpeg", "png"].includes(file.type.split("/")[1])) {
      return notify("Image type is not valid");
    }
  
    try {
      notify("Compressing image...");
      
      // Compression options
      const options = {
        maxSizeMB: 1, // Maximum file size (in MB)
        maxWidthOrHeight: 800, // Max width or height
        useWebWorker: true, // Speed up compression
      };
  
      const compressedFile = await imageCompression(file, options);
      console.log("Compressed File Size:", compressedFile.size / 1024, "KB");
  
      notify("Uploading...");
  
      const imageRef = ref(storage, `users/${compressedFile.name}`);
      await uploadBytes(imageRef, compressedFile);
      const url = await getDownloadURL(imageRef);
      
      console.log("url", url);
      seturl(url);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="admin-profile-container">
      <div className="admin-header flex">
        <div className="admin-profilepic">
          <img
            src={url ? url : user?.profilepic}
            alt=""
            onClick={() => fileref.current.click()}
          />
          <input
            className="profile-pic-input"
            ref={fileref}
            type="file"
            accept="image/*"
            onChange={uploadFile}
          />
        </div>
        <div className="admin-username flex column">
          <div className="username">Welcome, {user?.username}</div>
          <div className="role">
            {user?.role == "shop" ? "Vendor" : user?.role}
          </div>
        </div>
      </div>
      <div className="admin-details flex main-detail-cnt">
        <div className="main-detail">Your Products : {user?.products.length}</div>
        <div className="main-detail">Your Orders : {user?.shoporders.length}</div>
      </div>
      <form className="admin-details flex column" onSubmit={handleSubmit}>
        <div className="detail-head">
          <span>Edit Profile</span>
          <button>Save</button>
        </div>
        <div className="details-cnt flex">
          <div className="cnt">
            <div className="inp-cnt flex column">
              <label htmlFor="">Username</label>
              <input
                defaultValue={username}
                placeholder="Username"
                type="text"
                name=""
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Contact</label>
              <input
                value={contact}
                readOnly
                placeholder="Contact"
                type="text"
                name=""
                // onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Email</label>
              <input
                defaultValue={email}
                placeholder="Email"
                type="text"
                name=""
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Pin Code</label>
              <input
                defaultValue={pincode}
                placeholder="Pin Code"
                type="text"
                name=""
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
          </div>
          <div className="cnt">
            <div className="inp-cnt flex column">
              <label htmlFor="">House no.</label>
              <input
                defaultValue={house_no}
                placeholder="House no."
                type="text"
                name=""
                onChange={(e) => setHouse_no(e.target.value)}
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Area</label>
              <input
                defaultValue={area}
                placeholder="Area"
                type="text"
                name=""
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Landmark</label>
              <input
                defaultValue={landmark}
                placeholder="Landmark"
                type="text"
                name=""
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">City</label>
              <input
                defaultValue={city}
                placeholder="City"
                type="text"
                name=""
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
