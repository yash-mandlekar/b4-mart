import React, { useEffect, useState } from "react";
import Shops from "./Shops";
import "../../Css/Home.css";
import { useSelector } from "react-redux";
import Shopsearch from "./Shopsearch";
const MainContent = () => {
  var { shops } = useSelector((state) => state.user);
  const [near_shops, setnear_shops] = useState(shops);
  const [sname, setSname] = useState("");
  useEffect(() => {
    if (sname.length > 2) {
      setnear_shops(
        shops.filter((shop) => {
          return shop.username.toLowerCase().includes(sname.toLowerCase());
        }),
      );
    } else {
      setnear_shops(shops);
    }
  }, [sname, shops]);
  // console.log(near_shops);

  return (
    <>
      <Shopsearch sname={sname} setSname={setSname} />
      <div className="category">
        {/* <div className="ad-base">
        {ads.map((e, i) => (
          <Advertisement key={i} data={e} />
        ))}
      </div> */}
        <div className="shopBase">
          <h1>Shops</h1>
          <div className="container">
            {near_shops?.length > 0 ? (
              near_shops.map((e, i) => <Shops key={i} data={e} />)
            ) : (
              <h1>No nearby shops</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContent;
