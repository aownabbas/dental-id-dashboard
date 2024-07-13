import React, { useRef, useState, useEffect } from "react";
import "./dashboard.css";
import utils from "../../utils/utils";
import { fabric } from "fabric";
import { isMobile } from "react-device-detect";
import MobileLineMeasurement from "../../components/dashboard/mobile/mobile-line-measurement/MobileLineMeasurement";
import { Link } from "react-router-dom";
import Tools from "../../components/sideMenu/Tools";
import LogOut from "../../components/logout/LogOut";
import { useScreenshot, createFileName } from "use-react-screenshot";
import * as htmlToImage from "html-to-image";
import { getImageDimensions } from "../../helper";

var y11;
var y12;
var y21;
var y22;

var x11;
var x12;
var x21;
var x22;
var angle;
var angle1;
var angle2;

const Dashboard = () => {
  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const screenShotRef = useRef(null);

  const takeScreenShot = async (node) => {
    const dataURI = await htmlToImage.toPng(node, {
      backgroundColor: "white",
      quality: 1,
      // pixelRatio: 1,
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

  const [refrenceLineDistance, setRefrenceLineDistance] = useState(0);
  const [measureLineDistance, setMeasureLineDistance] = useState(0);
  const [result, setResult] = useState(0);
  const [unit, setUnit] = useState("");
  const [rotateThisImage, setrotateThisImage] = useState("");
  const [isInvert, setIsInvert] = useState(true);
  const [isSharpe, setisSharpe] = useState(true);
  const [range, setRange] = useState(0);
  const [isRange, setIsRange] = useState(false);
  const [isblendMode, setIsBlenMode] = useState(true);

  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAngle, setIsAngle] = useState(false);
  const [isAngleDraw, setIsAngleDraw] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [localFile, setLocalFile] = useState("");
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [angleResult, setAngleResult] = useState(0);

  useEffect(() => {
    calculate();
  }, [refrenceLineDistance, measureLineDistance, unit, result]);

  const handelPickFile = async (e) => {
    let innerWidth = 800;
    let innerHeight = 560;

    if (isMobile) {
      innerWidth = window.screen.width;
      innerHeight = window.screen.height / 3;
    }
    if (isFile) {
      resetEveryThing();
    }
    if (e.target.files.length) {
      setIsFile(true);
      var file = e.target.files[0];
      setLocalFile(file);

      var reader = new FileReader();
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
          // canvas.add(oImg).backgroundVpt = true;
          canvas.centerObject(oImg);
          setrotateThisImage(oImg);
          // canvas.setActiveObject(oImg);
        });
      };
      reader.readAsDataURL(file);
      var canvas = new fabric.Canvas("canvas", {
        serializeBgOverlay: false,
        width: innerWidth,
        height: innerHeight,
      });
      canvasRef.current = canvas;
      // fileRef.current = fabric.Image.filters;
      canvas.backgroundColor = "#f0f0f5";

      canvas.renderAll();
      // refrenceLine(canvas);
      // measureLine(canvas);
    }
  };

  const resetEveryThing = (escapEvent = false) => {
    try {
      const canvas = canvasRef.current;
      setIsAngleDraw(false);
      canvas.remove(...canvas.getObjects());
      setMeasureLineDistance(0);
      setAngleResult(0);
      setHistory([]);
      setUnit("");

      clearCanvasBackground();
    } catch (error) {
      console.log("error", error);
    }
  };
  function clearCanvasBackground() {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.setBackgroundImage(null);
      canvas.setBackgroundColor("");
      canvas.setDimensions({
        width: 500,
        height: 500,
      });
      canvasRef.current = null;

      canvas.off(); // Clear all event listeners
      canvas.clear(); // Clear the canvas and remove all objects
      canvas.dispose(); // Dispose the canvas
      canvas.renderAll();
    }
  }

  // user guid line horizontal lines
  const lineNumber1 = () => {
    const canvas = canvasRef.current;
    const _horizontalLine1 = new fabric.Line([10, 270, 1100, 270], {
      id: "line",
      stroke: "#FFFF01",
      strokeWidth: 2,
      lockScalingX: false,
      lockScalingY: false,
      lockRotation: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: false,
      lockMovementY: false,
      hasRotatingPoint: true,
      padding: 10,
      // strokeDashArray: [5, 5],
    });
    canvas.add(_horizontalLine1);
    canvas.renderAll();
  };
  // end of user guid line horizontal lines

  // *************************************************** //

  //  user guid line verticals lines
  const vlineNumber1 = () => {
    const canvas = canvasRef.current;
    const _verticalLine1 = new fabric.Line([450, 10, 450, 580], {
      id: "line",
      stroke: "#FFFF01",
      strokeWidth: 2,
      lockScalingX: false,
      lockScalingY: false,
      lockRotation: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: false,
      lockMovementY: false,
      hasRotatingPoint: true,
      // strokeDashArray: [5, 5],
      padding: 10,
    });
    canvas.add(_verticalLine1);
    canvas.renderAll();
  };

  const Measure = async () => {
    try {
      const canvas = canvasRef.current;
      const { width, height } = await getImageDimensions(localFile);
      refrenceLine(canvas);
      measureLine(canvas);
      drawAngle(canvas);
      setAngleResult(53);
      if (width > height) {
        setUnit(31);
      } else {
        setUnit(41);
      }
    } catch (error) {
      console.log("error", error);
    }

    // setUnit(41);
  };
  // end  useer guid line verticals lines
  // *************************************************** //

  const refrenceLine = (canvas) => {
    let isDraw = false;
    let panning = false;

    const refrenceLineCircle1 = new fabric.Circle({
      id: 1,
      left: 100,
      top: 0,
      stroke: "#4AD8BE",
      radius: 10,
      fill: "",
      originX: "center",
      originY: "center",
      transparentCorners: false,
      strokeWidth: 2,
      objectCaching: false,
      hasBorders: 0,
    });

    refrenceLineCircle1.hasControls = false;
    const refrenceLineCircle2 = new fabric.Circle({
      id: 2,
      left: 100,
      top: 560,
      stroke: "#4AD8BE",
      radius: 10,
      fill: "",
      originX: "center",
      originY: "center",
      transparentCorners: false,
      hasControls: false,
      strokeWidth: 2,
      objectCaching: false,
    });
    refrenceLineCircle2.hasControls = false;
    const box1point = refrenceLineCircle1.getPointByOrigin("center", "bottom");
    const box2point = refrenceLineCircle2.getPointByOrigin("center", "top");
    findRefrenceLineDistance(100, 100, 0, 560);
    const _refrenceLineConnector = new fabric.Line(
      [box1point.x, box1point.y - 10, box2point.x, box2point.y + 10],
      {
        stroke: "#4AD8BE",
        strokeWidth: 2,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hasBorders: true,
        lockMovementX: true,
        lockMovementY: true,
        hasRotatingPoint: true,
        // strokeDashArray: [5, 5],
      }
    );
    _refrenceLineConnector.hasControls = false;
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

    canvas.on("mouse:move", function (e) {
      if (panning && e && e.e) {
        // debugger;
        // var units = 10;
        var delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
      }
    });
    canvas.on("mouse:down", function (e) {
      if (
        e.target?.id === 1 ||
        e.target?.id === 2 ||
        e.target?.id === 3 ||
        e.target?.id === 4 ||
        e.target?.id === "line" ||
        e.target?.id === "textBox"
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

      findRefrenceLineDistance(
        _refrenceLineConnector.x1,
        _refrenceLineConnector.x2,
        _refrenceLineConnector.y1,
        _refrenceLineConnector.y2
      );
    });
    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 2) zoom = 2;
      if (zoom < 1) zoom = 1;
      // canvas.setZoom(zoom);
      canvas.zoomToPoint(
        {
          x: opt.e.offsetX,
          y: opt.e.offsetY,
        },
        zoom
      );
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  };
  const measureLine = (canvas) => {
    const measureLineCircle1 = new fabric.Circle({
      id: 3,
      left: 150,
      top: 50,
      stroke: "#20C3FF",
      radius: 10,
      fill: "",
      strokeWidth: 2,
      transparentCorners: true,
    });
    measureLineCircle1.hasControls = false;
    const measureLineCircle2 = new fabric.Circle({
      id: 4,
      left: 150,
      top: 350,
      stroke: "#20C3FF",
      radius: 10,
      fill: "",
      strokeWidth: 2,
      transparentCorners: true,
    });
    measureLineCircle2.hasControls = false;

    const box1point = measureLineCircle1.getPointByOrigin("center", "bottom");
    const box2point = measureLineCircle2.getPointByOrigin("center", "top");
    findMeasureLineDistance(50, 350, 400, 400);
    const _measureLineConnector = new fabric.Line(
      [box1point.x, box1point.y - 10, box2point.x, box2point.y + 10],
      {
        stroke: "#20C3FF",
        strokeWidth: 2,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasBorders: true,
        lockMovementX: true,
        lockMovementY: true,
        hasRotatingPoint: true,
      }
    );
    _measureLineConnector.hasControls = false;
    measureLineCircle1.on("moving", function () {
      const connectPoint = this.getPointByOrigin("center", "bottom");
      _measureLineConnector.set({
        x1: connectPoint.x,
        y1: connectPoint.y - 10,
      });
    });
    measureLineCircle2.on("moving", function () {
      const connectPoint = this.getPointByOrigin("center", "top");
      _measureLineConnector.set({
        x2: connectPoint.x,
        y2: connectPoint.y + 10,
      });
    });
    canvas.add(measureLineCircle1, measureLineCircle2, _measureLineConnector);

    canvas.on("mouse:down", function (e) {});
    canvas.on("mouse:up", function (e) {
      findMeasureLineDistance(
        _measureLineConnector.x1,
        _measureLineConnector.x2,
        _measureLineConnector.y1,
        _measureLineConnector.y2
      );
    });
  };

  // angle measurement
  const disabledDrawAngle = () => {
    return;
  };
  function drawAngle() {
    setIsAngleDraw(true);
    const canvas = canvasRef.current;
    var line2 = makeLine([250, 175, 250, 250]),
      line3 = makeLine([250, 250, 300, 350]),
      line4 = makeLine([250, 250, 200, 350]);

    canvas.add(line3, line4);

    canvas.add(
      makeCircle(line2.get("x2"), line2.get("y2"), line2, line3, line4),
      makeCircle(line3.get("x2"), line3.get("y2"), line3),
      makeCircle(line4.get("x2"), line4.get("y2"), line4)
    );

    canvas.on("object:moving", function (e) {
      var p = e.target;
      p.line1 &&
        p.line1.set({
          x2: p.left,
          y2: p.top,
        });
      p.line2 &&
        p.line2.set({
          x1: p.left,
          y1: p.top,
        });
      p.line3 &&
        p.line3.set({
          x1: p.left,
          y1: p.top,
        });
      p.line4 &&
        p.line4.set({
          x1: p.left,
          y1: p.top,
        });
      canvas.renderAll();

      y11 = line3.get("y1");
      y12 = line3.get("y2");
      y21 = line4.get("y1");
      y22 = line4.get("y2");

      x11 = line3.get("x1");
      x12 = line3.get("x2");
      x21 = line4.get("x1");
      x22 = line4.get("x2");

      angle1 = Math.atan2(y11 - y12, x11 - x12);
      angle2 = Math.atan2(y21 - y22, x21 - x22);
      angle = angle1 - angle2;
      angle = (angle * 180) / Math.PI;
      if (angle < 0) angle = -angle;
      if (360 - angle < angle) angle = 360 - angle;
      setAngleResult(angle);
    });
  }
  function makeCircle(left, top, line1, line2, line3, line4) {
    var c = new fabric.Circle({
      id: 1,
      left: left,
      top: top,
      originX: "center",
      originY: "center",
      objectCaching: false,
      stroke: "red",
      radius: 6,
      fill: "",
      strokeWidth: 2,
      transparentCorners: false,
    });
    c.hasControls = c.hasBorders = false;

    c.line1 = line1;
    c.line2 = line2;
    c.line3 = line3;
    c.line4 = line4;

    return c;
  }
  function makeLine(coords) {
    return new fabric.Line(coords, {
      fill: "#FFFF01",
      stroke: "red",
      strokeWidth: 1,
      selectable: false,
    });
  }
  // end angle measurement
  const findRefrenceLineDistance = (x1, x2, y1, y2) => {
    const _lineLength = Math.hypot(x2 - x1, y2 - y1);
    setRefrenceLineDistance(_lineLength);
  };

  const findMeasureLineDistance = (x1, x2, y1, y2) => {
    const _lineLength = Math.hypot(x2 - x1, y2 - y1);
    setMeasureLineDistance(_lineLength);
  };
  const calculate = () => {
    if (unit === 0 || unit === "") {
      setResult(measureLineDistance);
    } else {
      if (measureLineDistance !== 0 && refrenceLineDistance !== 0) {
        const measurementResult =
          (measureLineDistance / refrenceLineDistance) * unit;
        setResult(measurementResult);
      }
    }
  };

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
      // canvas.setZoom(canvas.getZoom() / 1.1);
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
      rotateThisImage.angle = curAngle + 1;
      canvas.renderAll();
    } catch (error) {
      console.log("error", error);
    }
  };
  const rotateRight = () => {
    try {
      const canvas = canvasRef.current;
      var curAngle = rotateThisImage.angle;
      rotateThisImage.angle = curAngle - 1;
      canvas.renderAll();
    } catch (error) {
      console.log("error", error);
    }
  };
  const rotateLeftDegree = () => {
    try {
      const canvas = canvasRef.current;
      var curAngle = rotateThisImage.angle;
      rotateThisImage.angle = curAngle + 90;
      canvas.renderAll();
    } catch (error) {
      console.log("error", error);
    }
  };
  const rotateRightDegree = () => {
    try {
      const canvas = canvasRef.current;
      var curAngle = rotateThisImage.angle;
      rotateThisImage.angle = curAngle - 90;
      canvas.renderAll();
    } catch (error) {
      console.log("error", error);
    }
  };

  // invert color
  const invertColor = () => {
    setIsInvert(!isInvert);
    applyFilter(0, isInvert && new fabric.Image.filters.Invert());
  };

  function applyFilter(index, filter) {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  }
  // invert color end

  // shrpen
  const makeSharpen = () => {
    setisSharpe(!isSharpe);
    applyFiltermakeSharpen(
      1,
      isSharpe &&
        new fabric.Image.filters.Convolute({
          matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
          // matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        })
    );
  };

  function applyFiltermakeSharpen(index, filter) {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  }
  // end sharpen

  // contrast
  useEffect(() => {
    if (isRange) {
      contrats();
    }
  }, [range]);

  const contrats = () => {
    applyFilterContras(
      1,
      true &&
        new fabric.Image.filters.Contrast({
          contrast: range,
        })
    );
  };

  function applyFilterContras(index, filter) {
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
  // contrast end

  // blend mode and alpha color
  const blendMode = () => {
    setIsBlenMode(!isblendMode);
    applyFilterBlendMode(
      16,
      isblendMode &&
        new fabric.Image.filters.BlendColor({
          color: "#FFFFFF",
          mode: "overlay",
          alpha: 0.8,
        })
    );
  };
  const applyFilterBlendMode = (index, filter) => {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  };

  const addHistory = () => {
    if (title === "") {
      setErrorMessage("Title is required");
      return;
    }
    const _history = [...history];
    const data = {
      title: title,
      value: result,
      unit: unit.length ? "mm" : "px",
    };
    _history.push(data);
    setHistory(_history);
    setIsModalOpen(false);
    setTitle("");
  };
  const addAngleToHisotry = () => {
    if (title === "") {
      setErrorMessage("Title is required");
      return;
    }
    const _history = [...history];
    const data = {
      title: title,
      value: angleResult,
      unit: "deg",
    };
    _history.push(data);
    setHistory(_history);
    setIsAngle(false);
    setTitle("");
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    setIsAngleDraw(false);
    canvas.remove(...canvas.getObjects());
    setMeasureLineDistance(0);
    setAngleResult(0);
    setHistory([]);
    setUnit("");
  };
  const addTextOverObject = () => {
    const canvas = canvasRef.current;
    var text = new fabric.Textbox("Add Text", {
      id: "textBox",
      left: 200,
      top: 100,
      width: 200,
      fontSize: 15,
      fontFamily: "SFProDisplay-SemiBold",
      backgroundColor: "transparent",
      borderColor: "black",
      editingBorderColor: "black",
      padding: 2,
      showTextBoxBorder: true,
      textboxBorderColor: "black",
      fill: "yellow",
    });

    canvas.add(text);
  };
  return (
    <>
      <div className="d-dashboad-container" ref={screenShotRef}>
        <div className="d-dashboard-top-row">
          <div className="d-dashboard-top-row-logo-container">
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
              className="d-dashboard-top-row-new-image-container"
              onClick={() => fileRef.current.click()}
            >
              <img
                src={utils.icons.newImage}
                className="d-dashboard-top-row-new-image"
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
            <div className="d-dashboard-top-row-result-scale-container">
              <img src={utils.icons.rotateIcon} alt="rotate" />
              <p>Set Scale</p>
              <div className="d-dashboard-top-row-input-container">
                <input
                  type={"text"}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
                <p>mm</p>
              </div>
            </div>
            <div className="d-lines">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={utils.icons.refrencelineIcon}
                  style={{ height: "2px", width: "20px" }}
                  alt="refrence line"
                />
                <p>Scale Length</p>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={utils.icons.measurelineIcon}
                  style={{ height: "2px", width: "20px" }}
                  alt="measurement line"
                />
                <p>Measurement</p>
              </div>
            </div>
            <div className="d-measure_and_reset_buttons_container">
              {isFile ? (
                <div
                  className={
                    !isAngleDraw
                      ? "d-dashboard-angle-container"
                      : "d-dashboard-angle-container_disb"
                  }
                  onClick={!isAngleDraw ? Measure : disabledDrawAngle}
                >
                  <img src={utils.icons.refrenceRuler} alt="rotate" />
                  <strong>Measure</strong>
                </div>
              ) : (
                <div className="d-dashboard-angle-container_disb">
                  <img src={utils.icons.refrenceRuler} alt="rotate" />
                  <strong>Measure</strong>
                </div>
              )}
              <div
                className={
                  isAngleDraw
                    ? "d-dashboard-angle-container"
                    : "d-dashboard-angle-container_disb"
                }
                onClick={resetCanvas}
              >
                <img src={utils.icons.resetPolygon} alt="rotate" />
                <strong>Reset</strong>
              </div>
            </div>
            <div className="d-dashboard-top-row-measurement-container">
              {/* <div className="d-dmeasurement-icon-contaienr"></div> */}
              <div className="d-result">
                {result !== 0 ? (
                  <strong>
                    {measureLineDistance === 0 ? "" : result.toFixed(2)}
                    &nbsp; {unit > 0 ? "mm" : "px"}
                  </strong>
                ) : (
                  <strong>0</strong>
                )}
              </div>
              {result !== 0 && (
                <div
                  className="a-save_button"
                  onClick={() => {
                    // if (result === 0) {
                    //   return;
                    // }
                    setIsModalOpen(true);
                  }}
                >
                  Save
                </div>
              )}
            </div>
            <div className="angle-dashboard-top-row-measurement-container">
              <div className="angle-result">
                <strong>
                  {angleResult.toFixed(0)}
                  <span>{"\u00b0"}</span>
                </strong>
              </div>
              {angleResult !== 0 && (
                <div
                  className="angle-save_button"
                  onClick={() => {
                    setIsAngle(true);
                  }}
                >
                  Save
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              className="screenshot"
              onClick={downloadScreenshot}
              style={{ marginLeft: 20 }}
            >
              <p>Screenshot</p>
            </div>
            {/* <LogOut /> */}
          </div>
          {/* <LogOut /> */}
        </div>

        <div className="d-dashboard-body">
          <div className={"d-dashboard-body-side-menu-container"}>
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
              title={"Annotation"}
              firstIcon={utils.icons.textIcon}
              secondIcon={null}
              firstAction={"Text"}
              secondAction={""}
              onFirstAction={addTextOverObject}
              onSecondAction={() => {
                return null;
              }}
            />
            {/* <Tools
              title={"Mask"}
              firstIcon={utils.icons.overlay}
              secondIcon={null}
              firstAction={isblendMode ? "Overlay" : "Overlay"}
              secondAction={""}
              onFirstAction={blendMode}
              onSecondAction={() => {
                return null;
              }}
            /> */}
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
              title={"Guidelines"}
              firstIcon={utils.icons.guidHorizontal}
              secondIcon={utils.icons.guidVertical}
              secondAction={"Vertical"}
              firstAction={"Horizontal "}
              onFirstAction={lineNumber1}
              onSecondAction={vlineNumber1}
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
              title={<span> Rotate 1{"\u00b0"}</span>}
              firstIcon={utils.icons.rotateleft}
              secondIcon={utils.icons.rotateright}
              firstAction={"Left"}
              secondAction={"Right"}
              onFirstAction={rotateRight}
              onSecondAction={rotateLeft}
            />
            <Tools
              title={<span> Rotate 90{"\u00b0"}</span>}
              firstIcon={utils.icons.rotateleft}
              secondIcon={utils.icons.rotateright}
              firstAction={"Left"}
              secondAction={"Right"}
              onFirstAction={rotateRightDegree}
              onSecondAction={rotateLeftDegree}
            />
          </div>

          <div className="d-canvas-container-body" id="parent">
            <canvas ref={canvasRef} id="canvas" />
          </div>
        </div>
        {history.length ? (
          <div className="a-image-history">
            <h4>History Log</h4>
            <div className="a-history">
              <div>
                <strong className="history-log-title">Tooth #</strong>
              </div>
              <span>
                <strong className="history-log-title">Measurement</strong>
              </span>
            </div>
            {history.map((item, index) => {
              return (
                <div className="a-history" key={index}>
                  <div>
                    {/* <strong>{index + 1}.</strong> */}
                    <strong className="history-log-title">
                      {" "}
                      &nbsp; {item.title}
                    </strong>
                  </div>
                  <span>
                    {item.unit === "deg"
                      ? item.value.toFixed(0)
                      : item.value.toFixed(2) ?? "0"}
                    &nbsp;
                    {item.unit === "deg" ? <span>{"\u00b0"}</span> : item.unit}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
        {isModalOpen && (
          <div className="pop_up">
            <div className="pop_up_modal">
              <h2>Enter Tooth #</h2>
              {/* <p>
                  Please add a title for result and save which will show in the
                  history of image
                </p> */}
              <input
                placeholder="Tooth #"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setErrorMessage("")}
              />
              <span>{errorMessage}</span>
              <div className="pop_up_modal__buttons">
                <div className="pop_up_modal__save_button" onClick={addHistory}>
                  Save
                </div>
                <div
                  className="pop_up_modal__close_button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>
        )}
        {isAngle && (
          <div className="pop_up">
            <div className="pop_up_modal">
              <h2>Enter Tooth #</h2>
              {/* <p>
                  Please add a title for result and save which will show in the
                  history of image
                </p> */}
              <input
                placeholder="Tooth #"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setErrorMessage("")}
              />
              <span>{errorMessage}</span>
              <div className="pop_up_modal__buttons">
                <div
                  className="pop_up_modal__save_button"
                  onClick={addAngleToHisotry}
                >
                  Save
                </div>
                <div
                  className="pop_up_modal__close_button"
                  onClick={() => setIsAngle(false)}
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
