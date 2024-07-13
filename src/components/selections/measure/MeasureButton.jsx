import React from "react";
import "./measureButton.css";
import utils from "../../../utils/utils";

const MeasureButton = (props) => {
  const {title,icon}=props;

  return (
    <div
      className="measure-button-container"
      style={{
        backgroundColor: props.isBackgroundColor ? "#20C3FF" : "#FEFEFF",
      }}
    >
      <div className="measureMent-area-line1">
        <div>
          <img src={icon} height={60} width={60} alt="logo" />
        </div>
        <div>
          <p>{title}</p>
        </div>
      </div>
      <div className="measureMent-area-line2">
        <div>
          <p>Access <span><img src={utils.icons.rightArrow} height={30} width={30} alt="arrow-right" /></span></p>
        </div>
        <div>
          <img src={utils.icons.cardItems} height={90} width={45} alt="logo" />
        </div>

      </div>
    </div>
  );
};

export default MeasureButton;
{/* <div className="meaure-button-body">
        <div className="button-icon">
          <img src={props.icon} alt="icon" />
        </div>
        <div className="button-title">
          <p style={{ color: props.isBackgroundColor ? "#FFFFFF" : "#000000" }}>
            {props.title}
          </p>
        </div>
      </div> */}