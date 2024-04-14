import React from "react";
import "../styles/Blur.css";

const Blur = ({ h, w, bg, x, y, opacity, blur, translate_x, translate_y, border_radius }) => {
  return (
    <div
      className="blur"
      style={{
        height: h,
        width: w,
        background: bg,
        top: y,
        left: x,
        opacity: opacity,
        filter: `blur(${blur})`,
        transform: `translate(${translate_x}, ${translate_y})`,
        borderRadius: border_radius,
      }}
    ></div>
  );
};

export default Blur;