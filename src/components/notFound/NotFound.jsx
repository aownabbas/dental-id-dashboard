import React from "react";
import "./notfound.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notfound_container">
      <div className="notfound__body">
        <h1>404</h1>
        <b>Page Not Found</b>
        <p>Sorry, the page you requested can not be found</p>

        <div className="go_back__button">
          <Link to="/">
            <span>Go Back</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
