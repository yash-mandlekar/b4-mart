import React from "react";
import support from "../../Images/support image.avif";

const Support = () => {
  return (
    <div>
      <div className="img">
        <img className="image" src={support} alt="Customer support" />
      </div>
      <div className="main">
        <div className="box1">
          <div className="box1_1">
            <img
              className="phone_logo"
              src="https://cdn3.vectorstock.com/i/1000x1000/42/52/call-icon-vector-21894252.jpg"
              alt="Phone icon"
            />
          </div>
          <div className="box1_2">
            <div>
              <h3>Call</h3>
            </div>
            <br />
            <div>+91 6260755443</div>
          </div>
        </div>
        <div className="box2">
          <div className="box2_1">
            <img
              className="email"
              src="https://t3.ftcdn.net/jpg/08/38/24/86/360_F_838248675_UtEmzGbyZcslXJDiI9h94KmcHl6Qxig8.jpg"
              alt="Email icon"
            />
          </div>
          <div className="box2_2">
            <div>
              <h3> Email</h3>
            </div>
            <br />
            <div>sahusurajbali@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
