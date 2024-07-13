import React from "react";
import "./tools.css";

const Tools = (props) => {
  return (
    <div className="tool_contianer">
      {props.title && <strong>{props.title}</strong>}
      <div className="tools_actions__container">
        <div
          className="tools_actions__container_img"
          onClick={props.onFirstAction}
        >
          <img src={props.firstIcon} />
          <span>{props.firstAction}</span>
        </div>
        <div
          className="tools_actions__container_img"
          onClick={props.onSecondAction}
        >
          {props.secondIcon && <img src={props.secondIcon} />}
          <span>{props.secondAction}</span>
        </div>
      </div>
    </div>
  );
};

export default Tools;
