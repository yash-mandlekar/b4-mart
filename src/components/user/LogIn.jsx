import React, { useEffect, useState } from "react";
import "../../Css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../Axios";
import { notify } from "../common/Toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
import { asyncloaduser } from "../../store/userActions";

const LogIn = () => {
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const { page_loading, role } = useSelector((state) => state.user);

  const [page, setpage] = useState(0);
  const [formdata, setFormdata] = useState({
    contact: "",
    otp: "",
  });
  const { contact, otp } = formdata;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (contact.length != 10) return notify("Enter a vaild number");
      const { data } = await Axios.post("/login", { contact });
      notify(data.message);
      if (data.message == "OTP send succesfully") {
        setpage(1);
      }
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp.length != 4) return notify("Enter a vaild OTP");
    const { data } = await Axios.post("/otp", { contact, otp });

    if (data.success) {
      console.log(data.token);
      document.cookie = `token=${data.token}`;
      Dispatch(asyncloaduser());
      navigate("/home");
    } else {
      notify(data.message);
    }
  };
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const hack = async () => {
    const { data } = await Axios.post("/login", {
      contact: "1234567890",
      hack: true,
    });
    console.log(data);

    if (data.message == "OTP send succesfully") {
      setFormdata({
        contact: "1234567890",
        otp: data.user.otp,
      });
      setpage(1);
    }
  };

  useEffect(() => {
    if (role == "user") {
      navigate("/home");
    } else if (role == "admin" || role == "shop") {
      navigate("/admin");
    }
  }, []);
  return page_loading ? (
    <Loader />
  ) : (
    <>
      <div className="base">
        <div className="text">
          <h1>Welcome Back.!</h1>
          <div>
            <div onClick={hack} className="skip">
              Skip the lag?
            </div>
          </div>
        </div>
        <div className="loginForm">
          <div className="box"></div>
          <div className="box2"></div>
          <div className="loginBox">
            <p className="title">Login</p>
            {/* <p className="title toto">Enter Your Phone Number</p> */}
            <p className="sp-text">
              We will send you 4 digit verification code
            </p>
            {page == 0 ? (
              <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="username">Mobile</label>
                  <input
                    type="number"
                    name="contact"
                    id="number"
                    placeholder="Mobile No.  "
                    onChange={handleChange}
                    value={contact}
                  />
                </div>

                <button className="sign">Generate OTP</button>
              </form>
            ) : (
              <form className="form" onSubmit={handleOTPSubmit}>
                <div className="input-group">
                  <label htmlFor="password">OTP</label>
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    placeholder="Enter your OTP"
                    onChange={handleChange}
                    value={otp}
                  />
                </div>
                <button className="sign">Login</button>
              </form>
            )}
            <div className="social-message">
              <div className="line"></div>
              <p className="message"></p>
              <div className="line"></div>
            </div>

            <div className="link">
              <Link>Terms & Conditions</Link>
              <Link>Support</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
