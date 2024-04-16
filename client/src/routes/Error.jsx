import React from "react";
import { Link, useRouteError } from "react-router-dom";
import Blur from "../components/Blur";
import Button from "../components/Button";
import "../styles/Error.css";

const Error = () => {
  let error = useRouteError();
  console.log(error);
  return (
    <div className="error-container">
      <Blur
        h={"35%"}
        w={"50%"}
        bg={"#7000FF"}
        x={"50%"}
        y={"50%"}
        opacity={0.2}
        blur={"250px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />
      <Blur
        h={"45%"}
        w={"50%"}
        bg={"#FF00C7"}
        x={"50%"}
        y={"50%"}
        opacity={0.2}
        blur={"250px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />
      <p className="error-page-status">{error.status || "Oops..."}</p>
      <p className="error-page-status-text">{error.statusText || "Something went wrong."}</p>
      <Button variant="outlined" size="md">
        <Link to={"/"}>Back to Home</Link>
      </Button>
    </div>
  );
};

export default Error;