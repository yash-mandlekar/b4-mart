import React, { useEffect, useState } from "react";
import "../../Css/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { asyncadminlogin } from "../../store/userActions";
import { useNavigate } from "react-router-dom";
const AdminLogin = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [formdata, setFormdata] = useState({
    contact: "",
    password: "",
  });
  const { contact, password } = formdata;
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(asyncadminlogin(formdata));
  };
  useEffect(() => {
    if (role == "shop" || role == "admin") {
      navigate("/admin");
    }
  }, [role]);
  return (
    <div className="adminpage" style={{ backgroundColor: "#e8e8e8" }}>
      <form className="form-control" onSubmit={handleSubmit}>
        <p className="title">Admin Login</p>
        <div className="input-field">
          <input
            name="contact"
            onChange={handleChange}
            value={contact}
            required=""
            className="inputAdmin"
            type="text"
            placeholder="Enter Number"
          />
         
        </div>
        <div className="input-field">
          <input
            name="password"
            onChange={handleChange}
            value={password}
            required=""
            className="inputAdmin"
            type="password"
            placeholder="Password"
          />
        
        </div>

        <button className="submit-btn">Sign In</button>
      </form>
    </div>
  );
};

export default AdminLogin;
