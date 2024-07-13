import React from "react";
import "./style.css";
import { message, Spin } from "antd";

const Loader = () => {
  return (
    <div className="loader__container">
      <div className="loader__body">
        <Spin size="large" style={{ backgroundColor: "black" }} />
      </div>
    </div>
  );
};

export default Loader;
