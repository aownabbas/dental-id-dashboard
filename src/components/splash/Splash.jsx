import React from "react";
import utils from "../../utils/utils";
import "./splash.css";

const Splash = () => {
  return (
    <div className="splash">
      <div className="splash-icon-container">
        <div className="splash-rounde-icon">
          <img src={utils.images.roundIcon} alt="round icon" />
        </div>
      </div>
      <div className="splash-logo-container">
        <img src={utils.images.logo} alt="logo" />
      </div>
    </div>
  );
};

export default Splash;
