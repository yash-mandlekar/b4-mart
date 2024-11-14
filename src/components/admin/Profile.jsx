import React from "react";
import "../../Css/AdminProfile.css";
import { useDispatch, useSelector } from "react-redux";
const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="admin-profile-container">
      <div className="admin-header flex">
        <div className="admin-profilepic">
          <img src={user?.profilepic} alt="" />
        </div>
        <div className="admin-username flex column">
          <div className="username">Welcome, {user?.username}</div>
          <div className="role">
            {user?.role == "shop" ? "Vendor" : user?.role}
          </div>
        </div>
      </div>
      <div className="admin-details flex main-detail-cnt">
        <div className="main-detail">Your Products : 0</div>
        <div className="main-detail">Your Orders : 0</div>
      </div>
      <form className="admin-details flex column">
        <div className="detail-head">
          <span>Edit Profile</span>
          <button>Save</button>
        </div>
        <div className="details-cnt flex">
          <div className="cnt">
            <div className="inp-cnt flex column">
              <label htmlFor="">Username</label>
              <input
                value={user?.username}
                defaultValue={user?.Username}
                placeholder="Username"
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Contact</label>
              <input
                defaultValue={user?.contact}
                placeholder="Contact"
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Email</label>
              <input
                defaultValue={user?.email}
                placeholder="Email"
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Pin Code</label>
              <input
                defaultValue={user?.pincode}
                placeholder="Pin Code"
                type="text"
                name=""
                id=""
              />
            </div>
          </div>
          <div className="cnt">
            <div className="inp-cnt flex column">
              <label htmlFor="">House no.</label>
              <input
                defaultValue={user?.house_no}
                placeholder="House no."
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Area</label>
              <input
                defaultValue={user?.area}
                placeholder="Area"
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">Landmark</label>
              <input
                defaultValue={user?.landmark}
                placeholder="Landmark"
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="inp-cnt flex column">
              <label htmlFor="">City</label>
              <input
                defaultValue={user?.city}
                placeholder="City"
                type="text"
                name=""
                id=""
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
