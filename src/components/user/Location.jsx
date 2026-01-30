import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncsetLocation } from "../../store/userActions";

const Location = () => {
  useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(location);
  const handleChange = () => {
    window.localStorage.removeItem("location");
    dispatch(asyncsetLocation({}));
  };
  return (
    <div>
      <button className="location-btn" onClick={handleChange}>
        Reset your address
      </button>
    </div>
  );
};

export default Location;
