import React from "react";
import "./style.css";

function ActionTools({
  firstIcon,
  secondIcon,
  firstAction,
  secondAction,
  onFirstAction,
  onSecondAction,
}) {
  return (
    <div className="action_container">
      <div className="actions_tools__container">
        <img src={firstIcon} />
        <span className="icon_toolkit">{firstAction}</span>
      </div>
      <div className="actions_tools__container">
        {secondIcon && <img src={secondIcon} />}
        <span className="icon_toolkit">{secondAction}</span>
      </div>
    </div>
  );
}

export default ActionTools;
