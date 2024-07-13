import React, { useCallback, useRef, useState } from "react";
import "./areaMeasurement.css";
import utils from "../../utils/utils";
import { fabric } from "fabric";
import { Link } from "react-router-dom";

import "react-input-range/lib/css/index.css";
import { useEffect } from "react";
import Tools from "../../components/sideMenu/Tools";

import LogOut from "../../components/logout/LogOut";
import { createFileName } from "use-react-screenshot";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import ActionTools from "../../components/sideMenu/ActionTools";

var roof = null;
var roofPoints = [];
var lines = [];
var lineCounter = 0;
var drawingObject = {};
drawingObject.type = "";
drawingObject.background = "";
drawingObject.border = "";
var startingPointCircle;
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
let canvasWidth = 0;
let canvasHeight = 0;

function Point(x, y) {
  this.x = x;
  this.y = y;
}
var areaUnit = "px";

const AreaMeasurement = () => {
  const screenShotRef = useRef(null);

  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const objRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resultForPulp, setResultForPulp] = useState([]);
  const [isMove, setIsMove] = useState(false);
  const [isLock, setIsLock] = useState(false);
  const [isInvert, setIsInvert] = useState(true);
  const [rotateThisImage, setrotateThisImage] = useState("");
  const [strokColor, setstrokColor] = useState("#FFFF01");
  const [isReset, setIsReset] = useState(false);
  const [unit, setUnit] = useState("");
  const [range, setRange] = useState(0);
  const [isRange, setIsRange] = useState(false);
  const [isSharpe, setisSharpe] = useState(true);
  const [isblendMode, setIsBlenMode] = useState(true);

  const [lineWidth, setLineWidth] = useState(3);
  const [lineSpace, setLineSpace] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("tooth");

  const [errorMessage, setErrorMessage] = useState("");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isActionPolyGon, setisActionPolygon] = useState(true);
  const [isFile, setIsFile] = useState(false);
  const [refrenceLineForAreaLength, setRefrenceLineForAreaLength] = useState(0);
  const [canvasDimentions, setCanvasDimentions] = useState({
    width: 0,
    height: 0,
  });

  const [imageBase64StringObj, setImageBase64StringObj] = useState(null);
  const [isResize, setIsResize] = useState(true);
  const [isEditingPolygon, setIsEditingPolygon] = useState(false);

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
    {
      name = imageBase64StringObj.fileName + "-screenshot",
      extension = "jpeg",
    } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = async () =>
    takeScreenShot(screenShotRef.current).then(download);

  useEffect(() => {
    if (currentPolygonArea !== null) {
      calcPolygonArea();
    }
  }, [unit]);

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      //Do whatever when esc is pressed
      resetPolygons(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    if (isRange) {
      contrats();
    }
  }, [range]);

  // rulerline

  const lineNumber1 = () => {
    const small = [0, 270, 1100, 270];
    const large = [-70, 270, 1800, 270];
    const canvas = canvasRef.current;
    const _horizontalLine1 = new fabric.Line(small, {
      id: "line",
      stroke: "#FFFF01",
      strokeWidth: 1,
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
  const vlineNumber1 = () => {
    const small = [200, 0, 200, 580];
    const large = [300, 0, 300, 1880];
    const canvas = canvasRef.current;
    const _verticalLine1 = new fabric.Line(small, {
      id: "line",
      stroke: "#FFFF01",
      strokeWidth: 1,
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

    canvas.add(_verticalLine1);
    canvas.renderAll();
  };

  // rulerline

  // pick image and start drawing polygon

  const handelPickFile = async (e) => {
    // let innerWidth = 920;
    var canvas = new fabric.Canvas("canvas", {
      serializeBgOverlay: false,
      backgroundVpt: true,
      selectable: false,
    });
    if (isFile) {
      resetCanvas();
    }

    if (e.target.files.length) {
      setIsReset(true);
      setIsFile(true);
      var file = e.target.files[0];
      var reader = new FileReader();
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        imgWidth = img.width;
        imgHeight = img.height;
      };
      reader.onload = function (f) {
        var data = f.target.result;

        let filenameWithoutExtension = file.name
          .split(".")
          .slice(0, -1)
          .join(".");

        setImageBase64StringObj({
          // fileName: filenameWithoutExtension,
          fileName: file.name,
          data: reader.result,
        });

        fabric.Image.fromURL(
          data,
          function (img) {
            const canvasWidth = 500; // Desired canvas width
            const canvasHeight = 500; // Desired canvas height

            const scaleFactor = Math.min(
              canvasWidth / img.width,
              canvasHeight / img.height
            );

            canvas.setDimensions({
              width: img.width * scaleFactor,
              height: img.height * scaleFactor,
            });

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
              // Optionally add an opacity lvl to the image
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height,
              top: 0,
              left: 0,
              originX: "center",
              originY: "center",
              selectable: false,

              // should the image be resized to fit the container?
            });

            canvas.centerObject(img);
            setrotateThisImage(img);
            resizeCanvasWindow(canvas, img);
          },
          { crossOrigin: "anonymous" }
        );
      };
      reader.readAsDataURL(file);
      canvas.backgroundColor = "#f0f0f5";
      canvas.hoverCursor = "pointer";
      canvasRef.current = canvas;
      canvas.selection = true;
      canvas.allowTouchScrolling = true;
      // fileRef.current = fabric.Image.filters;
      objRef.current = canvas.getActiveObject();

      canvas.renderAll();
    }
  };
  // refrence line for area
  const refrenceLineForArea = (canvas) => {
    let panning = false;
    let isDraw = false;

    const refrenceLineCircle1 = new fabric.Circle({
      id: 2,
      left: 30,
      top: 30,
      stroke: "#4AD8BE",
      radius: 10,
      fill: "",
      transparentCorners: true,
      hasControls: false,
      strokeWidth: 2,
      padding: 5,
      type: "refrence_circle",
    });
    refrenceLineCircle1.hasControls = false;
    refrenceLineCircle1.hasBorders = false;
    const refrenceLineCircle2 = new fabric.Circle({
      id: 3,
      left: 30,
      top: 250,
      stroke: "#4AD8BE",
      radius: 10,
      fill: "",
      transparentCorners: true,
      hasControls: false,
      strokeWidth: 2,
      padding: 5,
      type: "refrence_circle",
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
        hasRotatingPoint: false,
        selectable: false,
        hasBorders: false,
        // padding: 10,
        // strokeDashArray: [5, 5],
      }
    );
    _refrenceLineConnector.hasControls = false;
    refrenceLineCircle1.hasBorders = false;

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
  };
  const findRefrenceLineDistance = (x1, x2, y1, y2) => {
    const _lineLength = Math.hypot(x2 - x1, y2 - y1);
    refrenceLineLength = _lineLength;
    setRefrenceLineForAreaLength(_lineLength);
  };
  // refrence line for area end

  const createPoligon = () => {
    let startingCircle = null;
    if (!isFile) {
      return;
    }
    setisActionPolygon(false);
    setIsResize(false);

    const canvas = canvasRef.current;
    refrenceLineForArea(canvas);

    zoom = canvas.getZoom();

    canvas.on("mouse:down", function (options) {
      if (
        options.target?.id === 2 ||
        options.target?.id === 3 ||
        options.target?.id === "line" ||
        options.target?.id === "textBox"
      )
        return;
      if (roofPoints.length > 2) {
        if (options.target?.id === 1) {
          calcPolygonArea();

          drawPolygon(canvas);
          return;
        }
      }

      if (drawingObject.type === "roof") {
        canvas.selection = false;
        setStartingPoint(options); // set x,y
        const x = canvas.getPointer(options.e).x;
        const y = canvas.getPointer(options.e).y;
        roofPoints.push({ x, y });

        const points = [x, y, x, y];
        startingPointCircle = new fabric.Circle({
          id: 1,
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          objectCaching: false,
          stroke: strokColor,
          radius: 3,
          fill: "",
          strokeWidth: 1,
          transparentCorners: false,
          hasControls: false,
          lockScalingX: false, // Change to false
          lockScalingY: false, // Change to false
          lockRotation: true,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          type: "circle", // Correct the type to "circle"
        });
        startingPointCircle.hasControls = false;

        lines.push(
          new fabric.Line(points, {
            strokeWidth: 1,
            selectable: false,
            stroke: strokColor,
            strokeDashArray: [lineWidth, lineSpace],
            hasControls: false,
          })
        );

        canvas.add(startingPointCircle);
        canvas.add(lines[lineCounter]);

        canvas.renderAll();
        lineCounter++;
        canvas.on("mouse:up", function (options) {
          canvas.selection = true;
        });
      }
    });

    canvas.on("mouse:move", function (options) {
      if (
        lines[0] !== null &&
        lines[0] !== undefined &&
        drawingObject.type === "roof"
      ) {
        const x = canvas.getPointer(options.e).x;
        const y = canvas.getPointer(options.e).y;
        lines[lineCounter - 1].set({
          x2: x,
          y2: y,
        });
        canvas.renderAll();
      }
    });

    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      zoom *= 0.999 ** delta;
      if (zoom > 2) zoom = 2;
      if (zoom < 1) zoom = 1;
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

    // Keyboard Event Listener
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        undoLastPointAndLine();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    if (drawingObject.type === "roof") {
      drawingObject.type = "";
      lines.forEach(function (value, index, ar) {
        canvasRef.current.remove(value);
      });
      const roof = makeRoof(roofPoints);
      canvasRef.current.add(roof);
      canvasRef.current.renderAll();
    } else {
      drawingObject.type = "roof"; // roof type
    }
  };

  const editPolygon = (canvas) => {
    canvas.selection = false;

    removeReferenceLine(canvas);
    // Find the polygon object in the canvas
    const polygon = canvas.getObjects().find((obj) => obj.type === "polygon");

    if (!polygon) {
      console.log("No polygon found to edit. in edit function");
      return;
    }

    // Enable editing for the polygon
    polygon.edit = true;
    polygon.lockScalingX = polygon.lockScalingY = true;
    polygon.hasControls = false;

    let movingPoint = -1;

    // Remove the old event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    canvas.on("mouse:down", (event) => {
      const pointer = canvas.getPointer(event.e);
      const closePoint = polygon.points.find((point, index) => {
        const dx = pointer.x - point.x;
        const dy = pointer.y - point.y;
        return dx * dx + dy * dy < 36; // 6 * 6, adjust the distance as needed
      });

      if (closePoint) {
        movingPoint = polygon.points.indexOf(closePoint);
      }
    });
    canvas.on("mouse:move", (event) => {
      if (movingPoint >= 0) {
        const pointer = canvas.getPointer(event.e);
        const newPoint = {
          x: pointer.x,
          y: pointer.y,
        };
        polygon.points[movingPoint] = newPoint;
        roofPoints[movingPoint] = { x: newPoint.x, y: newPoint.y };
        polygon.dirty = true;

        // Update the corresponding circle position with the new point position
        const targetCircle = canvas.item(movingPoint);
        if (targetCircle && targetCircle.type === "circle") {
          targetCircle.set({
            left: newPoint.x,
            top: newPoint.y,
          });
        }

        // Update the corresponding line's end points
        const line = lines[movingPoint];
        if (line) {
          line.set({
            x1: newPoint.x,
            y1: newPoint.y,
            x2:
              movingPoint === polygon.points.length - 1
                ? polygon.points[0].x
                : polygon.points[movingPoint + 1].x,
            y2:
              movingPoint === polygon.points.length - 1
                ? polygon.points[0].y
                : polygon.points[movingPoint + 1].y,
          });
        }

        calcPolygonArea();
        canvas.renderAll();
      }
    });

    canvas.on("mouse:up", () => {
      movingPoint = -1;
      canvas.renderAll();
    });

    canvas.renderAll();
  };
  const updatePolygon = (canvas) => {
    const polygon = canvas.getObjects().find((obj) => obj.type === "polygon");
    if (!polygon) {
      console.log("No polygon found to update.");
      return;
    }

    // Update the polygon points from the roofPoints array
    polygon.points = roofPoints.map((point) => ({ x: point.x, y: point.y }));

    // Remove the old polygon from the canvas
    canvas.remove(polygon);
    drawPolygon(canvas);
    canvas.renderAll();
  };

  const enableEditPolygon = () => {
    setIsEditingPolygon(true);
    const canvas = canvasRef.current;
    canvas.selection = false;

    // Find the polygon object in the canvas
    const polygon = canvas.getObjects().find((obj) => obj.type === "polygon");

    if (!polygon) {
      console.log("No polygon found to edit.");
      return;
    }

    // Enable edit mode for the polygon

    editPolygon(canvas, polygon);
  };

  const disableEditPolygon = () => {
    setIsEditingPolygon(false);
    const canvas = canvasRef.current;

    // Find the polygon object in the canvas
    const polygon = canvas.getObjects().find((obj) => obj.type === "polygon");

    if (!polygon) {
      console.log("No polygon found.");
      return;
    }

    // Remove custom controls and enable regular controls
    polygon.edit = false;
    polygon.hasControls = false;
    polygon.hasBorders = false;
    polygon.evented = false;
    polygon.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    });
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    const referenceLineObjects = canvas
      .getObjects()
      .filter((obj) => obj.type === "refrence_circle" || obj.type === "line");
    referenceLineObjects.forEach((obj) => canvas.remove(obj));

    // Update the polygon with the edited points
    polygon.selectable = false;
    polygon.evented = true;
    polygon.lockMovementX = true;
    polygon.lockMovementY = true;
    updatePolygon(canvas, polygon);

    canvas.renderAll();
  };

  const setStartingPoint = (options, c) => {
    console.log("setStartingPoint function");

    const canvas = canvasRef.current;
    var pointer = canvas.getPointer(options.e);
    x = pointer.x;
    y = pointer.y;
  };

  const makeRoof = (roofPoints) => {
    console.log("make roof function");
    if (roofPoints[0]?.x && roofPoints[0]?.y) {
      var left = findLeftPaddingForRoof(roofPoints);
      var top = findTopPaddingForRoof(roofPoints);
      roofPoints.push(new Point(roofPoints[0].x, roofPoints[0].y));
      var roof = new fabric.Polyline(roofPoints, {
        stroke: strokColor,
        fill: "rgba(0,0,0,0)",
        strokeWidth: 1,
        hasRotatingPoint: false,
        strokeDashArray: [lineWidth, lineSpace],
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        type: "polygon",
      });
      roof.set({
        left: left,
        top: top,
      });
      return roof;
    } else return false;
  };

  const findTopPaddingForRoof = (roofPoints) => {
    var result = 999999;
    for (var f = 0; f < lineCounter; f++) {
      if (roofPoints[f].y < result) {
        result = roofPoints[f].y;
      }
    }
    return Math.abs(result);
  };

  const findLeftPaddingForRoof = (roofPoints) => {
    var result = 999999;
    for (var i = 0; i < lineCounter; i++) {
      if (roofPoints[i].x < result) {
        result = roofPoints[i].x;
      }
    }
    return Math.abs(result);
  };
  const drawPolygon = (canvas) => {
    drawingObject.type = "";
    lines.forEach(function (value) {
      canvas.remove(value);
    });

    if (roofPoints.length > 2) {
      const roof = new fabric.Polygon(roofPoints, {
        stroke: strokColor,
        fill: "rgba(0,0,0,0)",
        strokeWidth: 1,
        hasRotatingPoint: false,
        strokeDashArray: [lineWidth, lineSpace],
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        type: "polygon",
      });

      canvas.add(roof);
    }

    canvas.renderAll();
  };

  const removeReferenceLine = (canvas) => {
    const refrenceCircles = canvas
      .getObjects()
      .filter((obj) => obj.type === "refrence_circle");
    const refrenceLines = canvas
      .getObjects()
      .filter((obj) => obj.type === "line");

    refrenceCircles.forEach((circle) => canvas.remove(circle));
    refrenceLines.forEach((line) => canvas.remove(line));
  };

  const undoLastPointAndLine = () => {
    const canvas = canvasRef.current;
    if (currentPolygonArea !== null) {
      return;
    }
    if (roofPoints.length > 2 && lineCounter > 0) {
      const lastCircle = canvas.item(canvas.getObjects().length - 1);
      const lastLine = canvas.item(canvas.getObjects().length - 2);

      canvas.remove(lastLine);
      canvas.remove(lastCircle);

      roofPoints.pop();
      lines.pop();
      lineCounter--;

      if (lineCounter > 0) {
        const prevLine = lines[lineCounter - 1];
        startingPointCircle = canvas.item(
          canvas.getObjects().indexOf(prevLine) + 1
        );
      } else {
        startingPointCircle = null;
      }

      canvas.renderAll();
    }
  };
  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "z") {
      undoLastPointAndLine();
    }
  };
  const resetCanvas = (escapEvent = false) => {
    setisActionPolygon(true);
    setIsResize(true);
    try {
      document.removeEventListener("keydown", handleKeyDown);
      roofPoints = [];
      lines = [];
      lineCounter = 0;
      currentPolygonArea = null;

      if (resultData.length === 0 && !escapEvent) {
        return;
      }

      const canvas = canvasRef.current;
      canvas.remove(startingPointCircle);

      // canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      setIsLock(!isLock);
      canvas.remove(...canvas.getObjects());
      resultData = [];

      roof = null;
      startingPointCircle = {};
      x = 0;
      y = 0;
      clearCanvasBackground();
      document.addEventListener("keydown", handleKeyDown);
    } catch (error) {
      console.log("error", error);
    }
  };

  // reset polygon
  const resetPolygons = (escapEvent = false) => {
    setisActionPolygon(true);
    setIsResize(true);

    try {
      canvasRef.current.remove(startingPointCircle);

      roofPoints = [];
      lines = [];
      lineCounter = 0;
      currentPolygonArea = null;
      if (resultData.length === 0 && !escapEvent) {
        return;
      }
      const canvas = canvasRef.current;
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      setIsLock(!isLock);
      canvas.remove(...canvas.getObjects());
      roof = null;
      startingPointCircle = {};
      x = 0;
      y = 0;
    } catch (error) {
      console.log("error", error);
    }
  };

  // clear canvas  backgroundimage
  const clearCanvasBackground = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.setBackgroundImage(null);
      canvas.setBackgroundColor("");
      canvas.setDimensions({
        width: 500,
        height: 500,
      });
      canvasRef.current = null;
      setIsEditingPolygon(false);

      canvas.off(); // Clear all event listeners
      canvas.clear(); // Clear the canvas and remove all objects
      canvas.dispose(); // Dispose the canvas
      resetPolygons();

      canvas.renderAll();
    }
  };

  const calcPolygonArea = () => {
    let total = 0;
    let measurementResult;
    const canvas = canvasRef.current;

    // Get the height of the image
    const canvasWidth = canvas.width; // Get the width of the canvas
    const canvasHeight = canvas.height; // Get the height of the canvas

    for (let i = 0, l = roofPoints.length; i < l; i++) {
      var addX = roofPoints[i].x * (imgWidth / canvasWidth);
      var addY =
        roofPoints[i == roofPoints.length - 1 ? 0 : i + 1].y *
        (imgHeight / canvasHeight);
      var subX =
        roofPoints[i == roofPoints.length - 1 ? 0 : i + 1].x *
        (imgWidth / canvasWidth);
      var subY = roofPoints[i].y * (imgHeight / canvasHeight);

      total += addX * addY * 0.5 - subX * subY * 0.5;
    }

    if (refrenceLineLength <= 0 || unit === 0 || unit === "") {
      measurementResult = Math.abs(total);
    } else {
      measurementResult = (total / refrenceLineLength) * unit;
    }

    const data = {
      id: Math.random(100 * 0.1),
      results: Math.abs(measurementResult),
      unit: areaUnit,
    };

    currentPolygonArea = data;
    resultData.push(data);
    setResultForPulp({
      ...resultForPulp,
      data,
    });
  };

  // Tools and Actions

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
  const invertColor = () => {
    setIsInvert(!isInvert);
    applyFilterToInvertImage(0, isInvert && new fabric.Image.filters.Invert());
  };

  const applyFilterToInvertImage = (index, filter) => {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  };
  const contrats = () => {
    applyFilterForContrast(
      1,
      true &&
        new fabric.Image.filters.Contrast({
          contrast: range,
        })
    );
  };

  const applyFilterForContrast = (index, filter) => {
    const canvas = canvasRef.current;
    var obj = canvas.backgroundImage;
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
  };
  const increaseContrast = () => {
    setIsRange(true);
    setRange(range + 0.1);
  };
  const decreseContrast = () => {
    setIsRange(true);
    setRange(range - 0.1);
  };

  const makeSharpen = () => {
    setisSharpe(!isSharpe);
    applyFilterForSharpen(
      1,
      isSharpe &&
        new fabric.Image.filters.Convolute({
          matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
          // matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
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
      setErrorMessage("Tooth # is required");
      return;
    }
    const _points = roofPoints.map(({ x, y }) => [x, y]);
    const data = {
      id: Math.random(100 * 0.1),
      result: currentPolygonArea.results,
      points: _points,
      title: title,
      label: label,
      unit: areaUnit,
    };
    _historyLogs.push(data);
    setHistoryLogs(_historyLogs);
    setTitle("");
    setLabel("tooth");
    setIsModalOpen(false);
    scalePointsForLabelMe(_historyLogs);
  };

  const exportToJson = async () => {
    const canvas = canvasRef.current;

    await downloadScreenshot();
    const exportObject = {
      version: "4.5.12",
      flags: {},
      shapes: [],
      imagePath: imageBase64StringObj?.fileName,
      imageData: imageBase64StringObj?.data,
    };
    historyLogs.forEach((item) => {
      let shapeObj = {
        label: item.label,
        points: item.points,
        group_id: null,
        shape_type: "polygon",
        flags: {},
      };
      exportObject.shapes.push(shapeObj);
    });
    processImageAnalysisForLabelMe(exportObject);
  };

  const processImageAnalysisForLabelMe = (data) => {
    data.imageHeight = parseFloat(imgHeight);
    data.imageWidth = parseFloat(imgWidth);
    data.imageData = data.imageData.replace("data:image/jpeg;base64,", "");
    data.imageData = data.imageData.replace("data:image/png;base64,", "");
    data.imageData = data.imageData.replace("data:image/jpg;base64,", "");
    data.imageData = data.imageData.replace("data:image/bmp;base64,", "");
    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], { type: "application/json" });
    const fileName = imageBase64StringObj?.fileName
      .split(".")
      .slice(0, -1)
      .join(".");

    saveAs(blob, fileName + ".json");
  };

  const scalePointsForLabelMe = (data) => {
    const canvas = canvasRef.current;
    const widthScaleFactor = parseFloat(imgWidth) / parseFloat(canvas.width);
    const heightScaleFactor = parseFloat(imgHeight) / parseFloat(canvas.height);

    data[data.length - 1].points = scalePoints(
      data[data.length - 1].points,
      widthScaleFactor,
      heightScaleFactor
    );
  };

  const scalePoints = (points, widthScaleFactor, heightScaleFactor) => {
    return points.map((point) => [
      point[0] * widthScaleFactor,
      point[1] * heightScaleFactor,
    ]);
  };
  //

  const addTextOverObject = () => {
    const canvas = canvasRef.current;
    var text = new fabric.Textbox("Add Text", {
      id: "textBox",
      left: 50,
      top: 50,
      width: 200,
      fontSize: 12,
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

  const resizeCanvasWindow = (canvas, image) => {
    const canvasWrapper = document.getElementById("wrapper");
    let prevWidth = canvasWrapper.clientWidth;
    let prevHeight = canvasWrapper.clientHeight;

    const resizeCanvas = () => {
      const newWidth = canvasWrapper.clientWidth;
      const newHeight = canvasWrapper.clientHeight;

      if (newWidth !== prevWidth || newHeight !== prevHeight) {
        const widthDiff = newWidth - prevWidth;
        const heightDiff = newHeight - prevHeight;

        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);

        const imageWidth = image.getScaledWidth() + widthDiff;
        const imageHeight = image.getScaledHeight() + heightDiff;

        image.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          scaleX: imageWidth / image.width,
          scaleY: imageHeight / image.height,
          originX: "center",
          originY: "center",
        });

        canvas.renderAll();

        prevWidth = newWidth;
        prevHeight = newHeight;
      }
    };

    const handleWindowResize = () => {
      resizeCanvas();
    };

    const observeResize = () => {
      const observer = new ResizeObserver(() => {
        resizeCanvas();
      });

      observer.observe(canvasWrapper);
    };

    image.getElement().addEventListener("load", () => {
      resizeCanvas();
      observeResize();
    });

    resizeCanvas();
    observeResize();

    // Clean up the event listeners on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const downloadBackgroundImage = () => {
    const canvas = canvasRef.current;
    const backgroundImage = canvas.backgroundImage;

    if (backgroundImage) {
      const dataUrl = backgroundImage.toDataURL({
        format: "png", // Change format as needed
        quality: 1, // Adjust quality if needed
      });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "background_image.png"; // Change filename as needed
      link.click();
    }
  };

  return (
    <>
      <div className="a-dashboad-container" ref={screenShotRef}>
        <div className="a-dashboard-top-row">
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
            <div className="d-dashboard-top-row-result-scale-container">
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
            </div>

            <div className="a-lines">
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={utils.icons.refrencelineIcon}
                  style={{ height: "2px", width: "20px" }}
                  alt="refrence line"
                />
                <p>Scale Length</p>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={utils.icons.yellowLine}
                  style={{
                    height: "2px",
                    width: "20px",
                    backgroundColor: "rebeccapurple",
                  }}
                  alt="measurement line"
                />
                <p>Measurement</p>
              </div>
            </div>
            <div
              style={{ marginLeft: "10px" }}
              className="a-clear-button-active"
              onClick={() => {
                if (!isActionPolyGon) {
                  return;
                }
                createPoligon();
              }}
            >
              <img src={utils.icons.drawPolygon} alt="reset" />
              <span>Draw Polygon</span>
            </div>

            <div
              className="a-clear-button-active"
              onClick={() => {
                if (isActionPolyGon) {
                  return;
                }
                resetPolygons();
              }}
            >
              <img src={utils.icons.resetPolygon} alt="reset" />
              <span>Reset Polygon</span>
            </div>
            {/* {isFile && (
              <div
                className="a-clear-button-active"
                onClick={downloadBackgroundImage}
              >
                <img src={utils.icons.resetPolygon} alt="reset" />
                <span>Download</span>
              </div>
            )} */}
            {/* {currentPolygonArea !== null && currentPolygonArea.results > 0 && (
              <div
                className="a-clear-button-active"
                // id="editPolygonButton"
                onClick={
                  isEditingPolygon ? disableEditPolygon : enableEditPolygon
                }
              >
                <img src={utils.icons.resetPolygon} alt="reset" />
                <span>{isEditingPolygon ? "Done" : "Edit"} Polygon</span>
              </div>
            )} */}

            <div className="d-dashboard-top-row-measurement-container area-result-container">
              <div className="d-result">
                {currentPolygonArea !== null ? (
                  <strong>
                    {currentPolygonArea.results == 0
                      ? ""
                      : currentPolygonArea.results.toFixed(2)}
                    &nbsp;{" "}
                    {unit.length ? (
                      <>
                        mm<sup>2</sup>
                      </>
                    ) : (
                      "px"
                    )}
                  </strong>
                ) : (
                  <strong>0</strong>
                )}
              </div>
              {currentPolygonArea != null &&
                currentPolygonArea.results !== 0 && (
                  <div
                    className="a-save_button area-result-save-button"
                    onClick={() => {
                      // if (result === 0) {
                      //   return;
                      // }
                      setIsModalOpen(true);
                    }}
                  >
                    Add
                  </div>
                )}
            </div>

            {/* <div className="screenshot" onClick={downloadScreenshot}>
              <p>Screenshot</p>
            </div> */}
            {historyLogs.length > 0 && (
              <div className="screenshot" onClick={exportToJson}>
                <p>Save Results</p>
              </div>
            )}
          </div>

          {/* <LogOut /> */}
        </div>
        <div>
          <div className="a-dashboard-body">
            <div className="a-dashboard-body-side-menu-container">
              <Tools
                title="Tools"
                firstIcon={utils.icons.invert}
                secondIcon={utils.icons.sharpen}
                firstAction="Invert"
                secondAction="Sharpen"
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

              <Tools
                title={"Zoom"}
                firstIcon={utils.icons.zoomin}
                secondIcon={utils.icons.zoomout}
                firstAction={""}
                secondAction={""}
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

            <div className="a-canvas-container-body" id="parent">
              <div
                id="wrapper"
                style={{
                  display: !isFile ? "none" : "block",
                  resize: !isResize ? "none" : "both",
                }}
              >
                <canvas
                  ref={canvasRef}
                  id="canvas"
                  // style={{ maxHeight: 560, maxWidth: 600 }}
                  // style={{ maxHeight: 560, maxWidth: 600 }}
                />
              </div>
            </div>
          </div>
          {historyLogs.length > 0 && (
            <div className="a-image-history">
              <h4>History Log</h4>
              <div className="a-history">
                <div>
                  <strong className="history-log-title">Tooth</strong>
                </div>
                <span>
                  <strong className="history-log-title">Area</strong>
                </span>
              </div>
              {historyLogs.map((area, index) => {
                return (
                  <div className="a-history" key={index}>
                    <div>
                      {/* <strong>{index + 1}.</strong> */}
                      <strong className="history-log-title">
                        {" "}
                        &nbsp; {area.title} - {toTitleCase(area.label)}
                      </strong>
                    </div>

                    <span>
                      {area.result.toFixed(2) ?? "0"} &nbsp;{" "}
                      {area.unit === "mm" ? (
                        <>
                          mm<sup>2</sup>
                        </>
                      ) : (
                        area.unit
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {isModalOpen ? (
            <div className="pop_up">
              <div className="pop_up_modal">
                <h2>Enter Tooth Information</h2>
                {/* <p>
                  Please add a title for result and save which will show in the
                  history of image
                </p> */}
                <label>Tooth #</label>
                <input
                  placeholder="Enter tooth number"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setErrorMessage("")}
                />
                <span>{errorMessage}</span>

                {/* <br /> */}
                <label> Select Label</label>
                <select onChange={(e) => setLabel(e.target.value)}>
                  <option value="tooth">Tooth</option>
                  <option value="pulp">Pulp</option>
                  <option value="root">Root</option>
                </select>
                <div className="pop_up_modal__buttons">
                  <div
                    className="pop_up_modal__save_button"
                    onClick={onSaveHandler}
                  >
                    Add
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
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AreaMeasurement;
