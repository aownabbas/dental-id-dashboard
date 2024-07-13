import React, { useRef, useState } from "react";
import "./style.css";
import utils from "../../utils/utils";
import { fabric } from "fabric";
import { json, Link, useNavigate } from "react-router-dom";
import "react-input-range/lib/css/index.css";
import { useEffect } from "react";
import Tools from "../../components/sideMenu/Tools";
import aiImage from "../../assets/icons/ai.svg";
import logoutImage from "../../assets/icons/logout.svg";
import Loader from "../../components/loader/Loader";
import axios from "axios";
import { appendFormData } from "../../helper";
import { useDispatch } from "react-redux";
import { _setAiResponse } from "../../redux/actions/authAction";
import LogOut from "../../components/logout/LogOut";

var drawingObject = {};
drawingObject.type = "";
drawingObject.background = "";
drawingObject.border = "";
var imgHeight = 0;
var imgWidth = 0;
var resultData = [];
var lineWidthForLine = 0.9;
var x = 0;
var y = 0;
let zoom;
var constrastValue = 20;
var refrenceLineLength = 0;
var currentPolygonArea = null;
var measurementResult;

function Point(x, y) {
  this.x = x;
  this.y = y;
}
var areaUnit = "px";

const AiScreen = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const canvasRef = useRef(null);
  const objRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isInvert, setIsInvert] = useState(true);
  const [rotateThisImage, setrotateThisImage] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [unit, setUnit] = useState("");
  const [range, setRange] = useState(0);
  const [isRange, setIsRange] = useState(false);
  const [isSharpe, setisSharpe] = useState(true);
  const [isblendMode, setIsBlenMode] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isFile, setIsFile] = useState(false);
  const [refrenceLineForAreaLength, setRefrenceLineForAreaLength] = useState(0);
  const [file, setFile] = useState(null);
  const [coordinatePixles, setCoordinatePixles] = useState({
    x1: 111,
    y1: 112,
    x2: 111,
    y2: 260,
  });
  const dispatch = useDispatch();

  // first polygon for whole teeth
  const handelPickFile = (e) => {
    let innerWidth = 920;
    let innerHeight = 560;
    if (e.target.files.length) {
      setIsReset(true);
      setIsFile(true);
      var file = e.target.files[0];
      setFile(file);
      var reader = new FileReader();
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        imgWidth = img.width;
        imgHeight = img.height;
      };
      reader.onload = function (f) {
        var data = f.target.result;
        fabric.Image.fromURL(data, function (img) {
          var oImg = img
            .set({
              top: 0,
              left: 0,
              originX: "middle",
              originY: "middle",
            })
            .scale(0);

          oImg.scaleToWidth(innerWidth);
          oImg.scaleToHeight(innerHeight);
          canvas.setBackgroundImage(oImg).renderAll();

          canvas.centerObject(oImg);
          setrotateThisImage(oImg);
        });
      };
      reader.readAsDataURL(file);
      var canvas = new fabric.Canvas("canvas", {
        serializeBgOverlay: false,
        backgroundVpt: true,
      });
      canvas.setHeight(innerHeight);
      canvas.setWidth(innerWidth);
      canvas.hoverCursor = "pointer";
      canvasRef.current = canvas;
      fileRef.current = fabric.Image.filters;
      objRef.current = canvas.getActiveObject();
      canvas.backgroundColor = "#f0f0f5";
      // refrenceLineForArea(canvas);
      canvas.renderAll();
    }
  };

  const refrenceLineForArea = (canvas) => {
    let panning = false;
    let isDraw = false;

    const refrenceLineCircle1 = new fabric.Circle({
      id: 2,
      left: 100,
      top: 100,
      stroke: "#4AD8BE",
      radius: 10,
      fill: "",
      transparentCorners: true,
      hasControls: false,
      strokeWidth: 2,
    });
    refrenceLineCircle1.hasControls = false;
    refrenceLineCircle1.hasBorders = false;
    const refrenceLineCircle2 = new fabric.Circle({
      id: 3,
      left: 100,
      top: 250,
      stroke: "#4AD8BE",
      radius: 10,
      fill: "",
      transparentCorners: true,
      hasControls: false,
      strokeWidth: 2,
    });
    refrenceLineCircle2.hasControls = false;
    refrenceLineCircle2.hasBorders = false;

    const box1point = refrenceLineCircle1.getPointByOrigin("center", "bottom");
    const box2point = refrenceLineCircle2.getPointByOrigin("center", "top");
    findRefrenceLineDistance(100, 250, 50, 50);
    const _refrenceLineConnector = new fabric.Line(
      [box1point.x, box1point.y - 10, box2point.x, box2point.y + 10],
      {
        stroke: "#4AD8BE",
        strokeWidth: 2,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        hasRotatingPoint: true,
        selectable: false,
        hasBorders: false,
      }
    );
    _refrenceLineConnector.hasControls = false;
    refrenceLineCircle1.hasBorders = false;
    console.log("_refrenceLineConnector", _refrenceLineConnector);

    refrenceLineCircle1.on("moving", function () {
      const connectPoint = this.getPointByOrigin("center", "bottom");
      _refrenceLineConnector.set({
        x1: connectPoint.x,
        y1: connectPoint.y - 10,
      });
    });
    refrenceLineCircle2.on("moving", function () {
      const connectPoint = this.getPointByOrigin("center", "top");
      _refrenceLineConnector.set({
        x2: connectPoint.x,
        y2: connectPoint.y + 10,
      });
    });
    canvas.add(
      refrenceLineCircle1,
      refrenceLineCircle2,
      _refrenceLineConnector
    );
    // console.log("_refrenceLineConnector", _refrenceLineConnector);

    canvas.on("mouse:move", function (e) {
      if (panning && e && e.e) {
        var delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
      }
    });
    canvas.on("mouse:down", function (e) {
      if (
        e.target?.id === 2 ||
        e.target?.id === 3 ||
        e.target?.id === 4 ||
        e.target?.id === "line"
      ) {
        panning = false;
      } else {
        panning = true;
      }

      isDraw = true;
    });

    canvas.on("mouse:up", function (e) {
      if (!isDraw) return;
      panning = false;
      setCoordinatePixles({
        ...coordinatePixles,
        x1: _refrenceLineConnector.x1,
        y1: _refrenceLineConnector.y1,
        x2: _refrenceLineConnector.x2,
        y2: _refrenceLineConnector.y2,
      });
      findRefrenceLineDistance(
        _refrenceLineConnector.x1,
        _refrenceLineConnector.x2,
        _refrenceLineConnector.y1,
        _refrenceLineConnector.y2
      );
    });
  };
  // refrence line for area end

  const zoomIN = () => {
    try {
      let ZOOM_PERCENT = 1.2;
      const canvas = canvasRef.current;
      canvas.zoomToPoint(
        new fabric.Point(canvas.width / 2, canvas.height / 2),
        canvas.getZoom() * ZOOM_PERCENT
      );

      // canvas.setZoom(canvas.getZoom() * 1.1);
    } catch (error) {
      console.log("error", error);
    }
  };
  const zoomOut = () => {
    try {
      let ZOOM_PERCENT = 1.2;
      const canvas = canvasRef.current;
      canvas.zoomToPoint(
        new fabric.Point(canvas.width / 2, canvas.height / 2),
        canvas.getZoom() / ZOOM_PERCENT
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const moveright = () => {
    const canvas = canvasRef.current;
    var units = 10;
    var delta = new fabric.Point(units, 0);
    canvas.relativePan(delta);
  };
  const moveleft = () => {
    const canvas = canvasRef.current;
    var units = 10;
    var delta = new fabric.Point(-units, 0);
    canvas.relativePan(delta);
  };
  const moveUp = () => {
    const canvas = canvasRef.current;

    var units = 10;
    var delta = new fabric.Point(0, -units);
    canvas.relativePan(delta);
  };
  const moveDown = () => {
    const canvas = canvasRef.current;

    var units = 10;
    var delta = new fabric.Point(0, units);
    canvas.relativePan(delta);
  };
  const rotateLeft = () => {
    try {
      const canvas = canvasRef.current;
      var curAngle = rotateThisImage.angle;
      rotateThisImage.angle = curAngle + 1.5;
      canvas.renderAll();
    } catch (error) {
      console.log("error", error);
    }
  };
  const rotateRight = () => {
    try {
      const canvas = canvasRef.current;
      var curAngle = rotateThisImage.angle;
      rotateThisImage.angle = curAngle - 1.5;
      canvas.renderAll();
    } catch (error) {
      console.log("error", error);
    }
  };

  const findRefrenceLineDistance = (x1, x2, y1, y2) => {
    const _lineLength = Math.hypot(x2 - x1, y2 - y1);
    refrenceLineLength = _lineLength;
    //setRefrenceLineForAreaLength(_lineLength);
  };
  // ****************  Image tools start***************
  // invert colors
  const invertColor = () => {
    setIsInvert(!isInvert);
    applyFilterToInvertImage(0, isInvert && new fabric.Image.filters.Invert());
  };

  function applyFilterToInvertImage(index, filter) {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  }
  // invert colors end

  // contrast for image
  useEffect(() => {
    if (isRange) {
      contrats();
    }
  }, [range]);

  const contrats = () => {
    applyFilterForContrast(
      1,
      true &&
        new fabric.Image.filters.Contrast({
          contrast: range,
        })
    );
  };

  function applyFilterForContrast(index, filter) {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  }
  const increaseContrast = () => {
    setIsRange(true);
    setRange(range + 0.1);
  };
  const decreseContrast = () => {
    setIsRange(true);
    setRange(range - 0.1);
  };
  // contrast for image end

  // Sharpen image
  const makeSharpen = () => {
    setisSharpe(!isSharpe);
    applyFilterForSharpen(
      1,
      isSharpe &&
        new fabric.Image.filters.Convolute({
          matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        })
    );
  };

  function applyFilterForSharpen(index, filter) {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  }
  // Sharpen image end

  // Blend Mode with color and Alpha

  const blendMode = () => {
    setIsBlenMode(!isblendMode);
    applyFilterForBlendMode(
      16,
      isblendMode &&
        new fabric.Image.filters.BlendColor({
          color: "#FFFFFF",
          mode: "overlay",
          alpha: 0.8,
        })
    );
  };
  const applyFilterForBlendMode = (index, filter) => {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  };
  // ****************  Image tools end ***************

  const onSaveHandler = () => {
    const _historyLogs = [...historyLogs];
    if (title == "") {
      setErrorMessage("Title is required");
      return;
    }
    const data = {
      id: Math.random(100 * 0.1),
      result: currentPolygonArea.results,
      title: title,
      unit: areaUnit,
    };
    _historyLogs.push(data);
    setHistoryLogs(_historyLogs);
    setTitle("");
    setIsModalOpen(false);
  };

  const startUsingAI = async () => {
    try {
      // if (unit === "") {
      //   alert("Please set the  scale");
      //   return;
      // } else if (Number(unit) === 0) {
      //   alert("Scale value should be greater than 0");
      //   return;
      // }
      // } else if (Number(unit) < 50) {
      //   alert("Scale value should be greater than 50");
      //   return;
      // } else if (Number(unit) > 1000) {
      //   alert("Scale value should be less than 1000");
      //   return;
      // } else if (refrenceLineForAreaLength.toFixed(0) < 100) {
      //   alert("Length should be greater than 100");
      //   return;
      // } else if (refrenceLineForAreaLength.toFixed(0) > 3000) {
      //   alert("Length should be less than 3000");
      //   return;
      // }
      setLoading(true);
      const payload = {
        // pixel: refrenceLineForAreaLength.toFixed(0),
        // length_in_mm: unit,
        // x1: coordinatePixles.x1.toFixed(0),
        // x2: coordinatePixles.x2.toFixed(0),
        // y1: coordinatePixles.y1.toFixed(0),
        // y2: coordinatePixles.y2.toFixed(0),
        pass_key: "KW1555ZWRFFFRTTKW",
      };
      // return;
      const headers = {
        "content-type": "multipart/form-data",
        "content-type": "application/json",
      };
      const upload = appendFormData("file", file, payload);
      const response = await axios.post(
        "https://analysis-api.dentalid.app",
        upload,
        headers
      );

      if (response.data.status === "Failure") {
        alert("Invalid Image");
        setLoading(false);
        return;
      }
      if (response.status === 200) {
        if (response.data.StatusCode === 422) {
          alert("Invalid image");
          setLoading(false);
          return;
        }
        dispatch(_setAiResponse(response?.data));
        navigate("/ai-measurement/result");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      return;
    }
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="a-dashboad-container">
        <div className="ai_dashboard-top-row">
          <div className="a-dashboard-top-row-logo-container">
            <Link to={"/"}>
              <div className="d-dashboard-top-row-logo-body">
                <img
                  src={utils.images.applogo}
                  // className="d-dashboard-top-row-logo"
                  alt="logo"
                />
              </div>
            </Link>
            <div
              className="a-dashboard-top-row-new-image-container"
              onClick={() => fileRef.current.click()}
            >
              <img
                src={utils.icons.newImage}
                className="a-dashboard-top-row-new-image"
                alt="upload"
              />
              <input
                type={"file"}
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handelPickFile}
              />
              <strong>New Image</strong>
            </div>

            {/* <div className="d-dashboard-top-row-result-scale-container">
              <img src={utils.icons.rotateIcon} alt="rotate" />

              <p>Set Scale</p>
              <div className="d-dashboard-top-row-input-container">
                <input
                  type={"text"}
                  value={unit}
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value) {
                      areaUnit = "mm";
                    } else {
                      areaUnit = "px";
                    }
                    // if value is not blank, then test the regex
                    if (e.target.value === "" || re.test(e.target.value)) {
                      setUnit(e.target.value);
                    }
                  }}
                />
                <p>mm</p>
              </div>
            </div> */}
            {file ? (
              <div
                className="ai_submit_button_container"
                onClick={startUsingAI}
              >
                <p>AI Analysis</p>
              </div>
            ) : null}
          </div>

          {/* <LogOut /> */}
        </div>

        <div className="a-dashboard-body">
          {/* <div className="a-dashboard-body-side-menu-container">
            <Tools
              title={"Tools"}
              firstIcon={utils.icons.invert}
              secondIcon={utils.icons.sharpen}
              firstAction={"Invert"}
              secondAction={"Sharpen"}
              onFirstAction={invertColor}
              onSecondAction={makeSharpen}
            />
            <Tools
              title={"Contrast"}
              firstIcon={utils.icons.contrast}
              secondIcon={utils.icons.contrast}
              firstAction={"Increase"}
              secondAction={"Decrease"}
              onFirstAction={increaseContrast}
              onSecondAction={decreseContrast}
            />

            <Tools
              title={"Mask"}
              firstIcon={utils.icons.overlay}
              secondIcon={null}
              firstAction={isblendMode ? "Overlay" : "Remove"}
              secondAction={""}
              onFirstAction={blendMode}
              onSecondAction={() => {
                return null;
              }}
            />
            <Tools
              title={"Zoom"}
              firstIcon={utils.icons.zoomin}
              secondIcon={utils.icons.zoomout}
              firstAction={"In"}
              secondAction={"Out"}
              onFirstAction={zoomIN}
              onSecondAction={zoomOut}
            />

            <Tools
              title={"Move"}
              firstIcon={utils.icons.down}
              secondIcon={utils.icons.up}
              firstAction={"Down"}
              secondAction={"Up"}
              onFirstAction={moveDown}
              onSecondAction={moveUp}
            />
            <Tools
              title={""}
              firstIcon={utils.icons.left}
              secondIcon={utils.icons.right}
              firstAction={"Left"}
              secondAction={"Right"}
              onFirstAction={moveleft}
              onSecondAction={moveright}
            />
            <Tools
              title={"Rotate"}
              firstIcon={utils.icons.rotateleft}
              secondIcon={utils.icons.rotateright}
              firstAction={"Left"}
              secondAction={"Right"}
              onFirstAction={rotateRight}
              onSecondAction={rotateLeft}
            />
          </div> */}

          <div className="a-canvas-container-body" id="parent">
            <canvas ref={canvasRef} id="canvas" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AiScreen;
