import React, { useRef, useState } from "react";
import utils from "../../utils/utils";
import "./style.css";
import LogOut from "../../components/logout/LogOut";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useScreenshot, createFileName } from "use-react-screenshot";
import * as htmlToImage from "html-to-image";

const AiResponseScreen = () => {
  const screenShotRef = useRef(null);

  const takeScreenShot = async (node) => {
    const dataURI = await htmlToImage.toPng(node, {
      backgroundColor: "white",
      quality: 1,
      //pixelRatio: 1,
    });
    return dataURI;
  };
  const download = (
    image,
    { name = "screen shot", extension = "jpeg" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () =>
    takeScreenShot(screenShotRef.current).then(download);

  const aiData = useSelector((state) => state.auth.aiResponse);
  const prefix = "https://";
  return (
    <div className="ai__resposne_container" ref={screenShotRef}>
      <div className="ai__resposne_header">
        <div className="ai__resposne_header__logo_container">
          <Link to={"/"}>
            <div className="ai__resposne_header__logo">
              <img src={utils.images.applogo} />
              {/* <div className="ai__resposne_header__button">
              <p>Download</p>
            </div> */}
            </div>
          </Link>
        </div>
        <div style={{ display: "flex" }}>
          <div
            className="screenshot"
            onClick={downloadScreenshot}
            style={{ marginLeft: 20 }}
          >
            <p>Screenshot</p>
          </div>
          <LogOut />
        </div>
      </div>
      <div className="ai__resposne_body">
        <div className="ai__resposne_url">
          <img src={`${prefix}${aiData?.["Image Path"]}`} alt="url" />
        </div>
        <div className="ai__resposne_hostory">
          <h3>Results</h3>
          <div className="ai__response_table_header">
            <div className="s_number">
              <p>#</p>
            </div>
            <div className="tooth">
              <p>Tooth Area</p>
            </div>
            <div className="pulp">
              <p>Pulp Area</p>
            </div>
          </div>
          {aiData?.Data?.length ? (
            <>
              {aiData?.Data.map((item, index) => {
                return (
                  <div className="ai__resposne_hostory_detail" key={index}>
                    <div className="ai__response_table_values">
                      <div className="s_number">
                        <p>{index + 1}</p>
                      </div>
                      <div className="tooth">
                        <p>
                          {/* {item["tooth_area_in_mm"]} mm<sup>2</sup> */}
                          {/* <br /> */}

                          {!isNaN(item["tooth_area_in_pixels"])
                            ? `${item["tooth_area_in_pixels"]} px`
                            : "N/A"}
                        </p>
                      </div>
                      <div className="pulp">
                        <p>
                          {/* {item["pulp_area_in_mm"]} mm<sup>2</sup> */}
                          {/* <br /> */}
                          {!isNaN(item["pulp_area_in_pixels"])
                            ? `${item["pulp_area_in_pixels"]} px`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="ai_response_invalid">
              <p>Invalid image</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiResponseScreen;
