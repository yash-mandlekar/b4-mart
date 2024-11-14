import React from "react";
import { easeInOut, motion } from "framer-motion";
const Advertisement = ({ data }) => {

  return (
    <>
      <motion.div
        whileHover={{
          y: [0, -20, 0],
          transition: {
            duration: 0.7,
            repeat: Infinity,
            repeatType: "loop",
            ease: easeInOut,
          },
        }}
        initial={{ y: 0 }}
        className="boxex"
      >
        <img src={data.url} alt="" />
      </motion.div>
    </>
  );
};

export default Advertisement;
