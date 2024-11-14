import React, { useState } from "react";
import "../../Css/Overlay.css";
import { IoLocationOutline } from "react-icons/io5";
import Axios from "../../Axios";
import { useDispatch } from "react-redux";
import { asyncsetLocation } from "../../store/userActions";
import { notify } from "./Toast";

const Overlay = () => {
  const [Areas, setAreas] = useState([]);
  const dispatch = useDispatch();
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        dispatch(asyncsetLocation({ latitude, longitude }));
      },
      (err) => {
        notify(
          "We do not have permission to determine your location. Please enter manually"
        );
      }
    );
  };
  const handleChange = async (e) => {
    if (e.target.value.length > 2) {
      const { data } = await Axios.get(
        `/autosuggest_google?q=${e.target.value}`
      );
      setAreas(data);
    }
  };
  const handleClick = async (e) => {
    dispatch(asyncsetLocation(e));
  };
  return (
    <>
      <div className="overlay">
        <div className="box-cnt">
          <div className="detectPop">
            <h4>
              Welcome to <span>B4Mart</span>
            </h4>
            <div className="dup">
              <IoLocationOutline className="loca" />
              <p>
                Please provide your delivery location to see products at nearby
                store
              </p>
            </div>
            <div className="dend">
              <input
                className="dser"
                onChange={handleChange}
                placeholder="Search Places ..."
                // value={query}
              />

              <div className="or">OR</div>
              <button onClick={getLocation} className="dbut">
                Detect my location
              </button>
            </div>
          </div>
          <div className="detectbox">
            {Areas &&
              Areas.map((area, i) => (
                <div
                  key={i}
                  onClick={() => handleClick(area.location)}
                  className="dolo"
                >
                  <IoLocationOutline className="local" />
                  <p> {area.shortFormattedAddress} </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overlay;
