import React, { useEffect, useRef, useState } from "react";
import "./mobileAreaMeasurement.css";
import utils from "../../../../utils/utils";
import { fabric } from "fabric";

var roof = null;
var roofPoints = [];
var lines = [];
var lineCounter = 0;
var drawingObject = {};
drawingObject.type = "";
drawingObject.background = "";
drawingObject.border = "";
var resultData = 0;
var startingPointCircle;

var x = 0;
var y = 0;

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function MobileAreaMeasurement() {
  const fileRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState(0);
  const [unit, setUnit] = useState(0);
  const [isMove, setIsMove] = useState(false);
  const [rotateThisImage, setrotateThisImage] = useState("");
  const [isRotate, setIsRotate] = useState(false);
  const [isZoom, setIsZoom] = useState(false);

  // useEffect(() => {
  //   if (unit > 0) {
  //     calcPolygonArea();
  //   }
  // }, [unit]);
  const handelPickFile = (e) => {
    let innerWidth = 330;
    let innerHeight = 310;
    if (e.target.files.length) {
      var file = e.target.files[0];
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
              // scaleX: canvas.width / img.width,
              // scaleY: canvas.height / img.height,
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
      });
      canvas.setHeight(innerHeight);
      canvas.setWidth(innerWidth);

      canvasRef.current = canvas;
      createPoligon(canvas);
    }
  };
  const drawPolygon = (canvas) => {
    fabric.util.addListener(window, "click", function () {
      drawingObject.type = "";
      lines.forEach(function (value) {
        canvas.remove(value);
      });
      roof = makeRoof(roofPoints);
      if (roof) {
        canvas.add(roof);
        canvas.renderAll();
        roofPoints = [];
        lines = [];
        lineCounter = 0;
        canvas.remove(startingPointCircle);
      }
    });
  };
  const createPoligon = (canvas) => {
    let panning = false;

    canvas.on("mouse:down", function (options) {
      console.log("mouse:down");
      if (roofPoints.length > 2) {
        if (options.target?.id == 1) {
          setResult(calcPolygonArea());
          drawPolygon(canvas);
          return;
        }
      }
      if (drawingObject.type === "roof") {
        canvas.selection = false;
        setStartingPoint(options); // set x,y
        roofPoints.push(new Point(x, y));
        if (roofPoints.length == 1) {
          startingPointCircle = new fabric.Circle({
            id: 1,
            left: x - 5,
            top: y - 5,
            stroke: "#4AD8BE",
            radius: 10,
            fill: "",
            transparentCorners: true,
            hasControls: false,
          });
          startingPointCircle.hasControls = false;
          canvas.add(startingPointCircle);
        }

        var points = [x, y, x, y];
        lines.push(
          new fabric.Line(points, {
            strokeWidth: 3,
            selectable: false,
            stroke: "#20C3FF",
            strokeDashArray: [10, 2],
          })
        );
        canvas.add(lines[lineCounter]);
        lineCounter++;
        canvas.on("mouse:up", function (options) {
          console.log("mouse:up");

          canvas.selection = true;
        });
      }
      console.log("rooof", roofPoints);
    });
    canvas.on("mouse:move", function (options) {
      // if (panning && options && options.e) {
      //   var delta = new fabric.Point(options.e.movementX, options.e.movementY);
      //   canvas.relativePan(delta);
      // }
      if (
        lines[0] !== null &&
        lines[0] !== undefined &&
        drawingObject.type === "roof"
      ) {
        setStartingPoint(options);
        lines[lineCounter - 1].set({
          x2: x,
          y2: y,
        });
        canvas.renderAll();
      }
    });
    canvas.on("mouse:wheel", function (opt) {
      console.log("mouse:wheel");

      var delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
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

    if (drawingObject.type === "roof") {
      drawingObject.type = "";
      lines.forEach(function (value, index, ar) {
        canvasRef.current.remove(value);
      });
      //canvas.remove(lines[lineCounter - 1]);
      roof = makeRoof(roofPoints);
      canvasRef.current.add(roof);
      canvasRef.current.renderAll();
    } else {
      drawingObject.type = "roof"; // roof type
    }
  };

  function setStartingPoint(options, c) {
    var offset = canvasRef.current.calcOffset();
    x = options.e.pageX - offset._offset.left;
    y = options.e.pageY - offset._offset.top;
  }

  function makeRoof(roofPoints) {
    if (roofPoints[0]?.x && roofPoints[0]?.y) {
      var left = findLeftPaddingForRoof(roofPoints);
      var top = findTopPaddingForRoof(roofPoints);
      roofPoints.push(new Point(roofPoints[0].x, roofPoints[0].y));
      var roof = new fabric.Polyline(roofPoints, {
        stroke: "#20C3FF",
        fill: "rgba(0,0,0,0)",
        strokeWidth: 3,
        hasRotatingPoint: false,
        strokeDashArray: [10, 2],
        hasControls: true,
      });
      roof.set({
        left: left,
        top: top,
      });

      return roof;
    } else return false;
  }

  function findTopPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var f = 0; f < lineCounter; f++) {
      if (roofPoints[f].y < result) {
        result = roofPoints[f].y;
      }
    }
    return Math.abs(result);
  }

  function findLeftPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var i = 0; i < lineCounter; i++) {
      if (roofPoints[i].x < result) {
        result = roofPoints[i].x;
      }
    }
    return Math.abs(result);
  }

  function calcPolygonArea() {
    var total = 0;

    for (var i = 0, l = roofPoints.length; i < l; i++) {
      var addX = roofPoints[i].x;
      var addY = roofPoints[i == roofPoints.length - 1 ? 0 : i + 1].y;
      var subX = roofPoints[i == roofPoints.length - 1 ? 0 : i + 1].x;
      var subY = roofPoints[i].y;

      total += addX * addY * 0.5;
      total -= subX * subY * 0.5;
    }

    console.log("total", Math.abs(total));
    return Math.abs(total * 0.26458333333719);
  }

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

  const toggle = () => {
    setIsMove(!isMove);
  };
  const renderActions = () => {
    if (isRotate) {
      return (
        <div
          className={
            isRotate
              ? "rotate-actions-container"
              : "rotate-actions-container-active"
          }
        >
          <div onClick={rotateLeft}>
            <img src={utils.icons.rotateright} alt="rotate right" />
            <p>Left</p>
          </div>
          <div onClick={rotateRight}>
            <img src={utils.icons.rotateleft} alt="rotate left" />
            <p>Right</p>
          </div>
        </div>
      );
    } else if (isZoom) {
      return (
        <div
          className={
            isZoom
              ? "rotate-actions-container"
              : "rotate-actions-container-active"
          }
        >
          <div onClick={zoomIN}>
            <img src={utils.icons.zoomin} alt="zoom in" />
            <p>In</p>
          </div>
          <div onClick={zoomOut}>
            <img src={utils.icons.zoomout} alt="zoom out" />
            <p>Out</p>
          </div>
        </div>
      );
    } else if (isMove) {
      return (
        <div
          className={
            isMove
              ? "rotate-actions-container"
              : "rotate-actions-container-active"
          }
        >
          <div onClick={moveleft}>
            <img src={utils.icons.left} alt="left" />
            <p>Left</p>
          </div>
          <div onClick={moveUp}>
            <img src={utils.icons.up} alt="up" />
            <p>Up</p>
          </div>
          <div onClick={moveDown}>
            <img src={utils.icons.down} alt="down" />
            <p>Down</p>
          </div>
          <div onClick={moveright}>
            <img src={utils.icons.right} alt="right" />
            <p>Right</p>
          </div>
        </div>
      );
    } else return null;
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <div className="mobile-header-body">
          <div className="mobile-header-logo-container">
            <img src={utils.icons.dentelidIcon} alt="logo" />
          </div>
          <div
            className="mobile-header-addnew-image"
            onClick={() => fileRef.current.click()}
          >
            <img src={utils.icons.newImage} alt="upload" />
            <p>New Image</p>
            <input
              type={"file"}
              ref={fileRef}
              style={{ display: "none" }}
              onChange={handelPickFile}
            />
          </div>
        </div>
      </div>
      <div className="mobile-result-container">
        <div className="mobile-result-body">
          <div className="mobile-result-length-scale-container">
            {/* <img src={utils.icons.rotateIcon} alt="rotate icon" /> */}
            <p>To calculate area, start drawing polygon points on image.</p>
            {/* <div className="input-container">
              <input type={"text"} onChange={(e) => setUnit(e.target.value)} />
              <span>mm</span>
            </div> */}
          </div>
          <div className="mobile-line-result-container">
            <div className="mobile-line-result-body">
              <div style={{ flex: 1 }}>
                <img src={utils.icons.measurementIcon} alt="measurement icon" />
                <span>Measurement</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <p>{result.toFixed(2)}</p>
                <span>mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="parent"
        style={{
          height: 310,
          width: 330,
          marginTop: 20,
          borderRadius: 10,
          //   display: "flex",
          // backgroundColor: "#EEEEF5",
        }}
      >
        <canvas ref={canvasRef} id="canvas" />
      </div>
      <div className="mobile-footer">
        <div className="mobile-footer-body">
          <div className="footer-items">
            <p>Tools</p>
          </div>
          <div
            className="footer-items"
            onClick={() => {
              setIsRotate(true);
              setIsZoom(false);
              setIsMove(false);
            }}
          >
            <img
              src={
                !isRotate ? utils.icons.rotateIcon : utils.icons.rotateActive
              }
              alt="rotate"
            />
            <p>Rotate</p>
          </div>
          <div
            className="footer-items"
            onClick={() => {
              setIsZoom(true);
              setIsRotate(false);
              setIsMove(false);
            }}
          >
            <img
              src={!isZoom ? utils.icons.zoomIcon : utils.icons.zoomActive}
              alt="zoom"
            />
            <p>Zoom</p>
          </div>
          <div className="footer-items">
            <img src={utils.icons.colorIcon} alt="color" />
            <p>Color</p>
          </div>
          <div className="footer-items">
            <img src={utils.icons.contrastIcon} alt="contrast" />
            <p>Contrast</p>
          </div>
          <div
            className="footer-items"
            onClick={() => {
              setIsMove(true);
              setIsZoom(false);
              setIsRotate(false);
            }}
          >
            <img
              src={!isMove ? utils.icons.move : utils.icons.moveActive}
              alt="move"
            />
            <p>Move</p>
          </div>
        </div>
      </div>
      <div className="mobile-footer-animated">{renderActions()}</div>
    </div>
  );
}

export default MobileAreaMeasurement;
