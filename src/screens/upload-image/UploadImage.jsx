import React from "react";
import { Link } from "react-router-dom";
import utils from "../../utils/utils";
import "./uploadImage.css";
const UploadImage = () => {
  return (
    <div className="uploadImage-body">
      <div className="uploadImage-container">
        <div className="uploadImage-logo-container">
          <img src={utils.images.dentalidLogo} alt="dentailIdLogo" />
        </div>
        <div className="upload-file-container">
          <img src={utils.icons.uploadImageIcon} alt="upload " />
          <h4>Upload Image</h4>
        </div>
        <Link to="/dashboard">
          <button className="next-button">Next</button>
        </Link>
        <div>
          <p className="term-conditions">
            By uploading an image you agree to Dental iD's{" "}
            <strong>Terms of Service.</strong> <br />
            This site is protected by its
            <strong> Privacy Policy</strong> apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
