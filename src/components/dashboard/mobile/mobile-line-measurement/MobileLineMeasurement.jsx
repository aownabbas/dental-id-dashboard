import React, { useEffect, useRef, useState } from "react";
import "./mobileLineMeasurement.css";
import utils from "../../../../utils/utils";

import { fabric } from "fabric";

function MobileLineMeasurement() {
  const inputFileRef = useRef(null);
  const canvasRef = useRef(null);

  // const [isFile, setIsFile] = useState(false);
  const [refrenceLineDistance, setRefrenceLineDistance] = useState(0);
  const [measureLineDistance, setMeasureLineDistance] = useState(0);
  const [result, setResult] = useState(0);
  const [unit, setUnit] = useState(0);
  const [isMove, setIsMove] = useState(false);
  const [isRotate, setIsRotate] = useState(false);
  const [isZoom, setIsZoom] = useState(false);
  const [rotateThisImage, setrotateThisImage] = useState("");

  useEffect(() => {
    if (unit > 0) {
      calculate();
    }
  }, [refrenceLineDistance, measureLineDistance, unit]);

  const handelPickFile = (e) => {
    let innerWidth = window.screen.availWidth;
    let innerHeight = 300;

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
            .scale(1);
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
        width: innerWidth,
        height: innerHeight,
      });

      canvasRef.current = canvas;
      refrenceLine(canvas);
      measureLine(canvas);
    }
  };
  const refrenceLine = (canvas) => {
    let isDraw = false;

    const refrenceLineCircle1 = new fabric.Circle({
      left: 50,
      top: 50,
      stroke: "#4AD8BE",
      radius: 10,
      fill: "",
      transparentCorners: true,
      hasControls: false,
    });
    refrenceLineCircle1.hasControls = false;
    const refrenceLineCircle2 = new fabric.Circle({
      left: 50,
      top: 150,
      stroke: "#4AD8BE",
      radius: 10,
      fill: "",
      transparentCorners: true,
      hasControls: false,
    });
    refrenceLineCircle2.hasControls = false;
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
        hasControls: true,
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
    canvas.on("mouse:down", function (e) {
      isDraw = true;
    });

    canvas.on("mouse:up", function (e) {
      if (!isDraw) return;
      findRefrenceLineDistance(
        _refrenceLineConnector.x1,
        _refrenceLineConnector.x2,
        _refrenceLineConnector.y1,
        _refrenceLineConnector.y2
      );
    });
  };
  const measureLine = (canvas) => {
    const measureLineCircle1 = new fabric.Circle({
      left: 100,
      top: 50,
      stroke: "#20C3FF",
      radius: 10,

      fill: "",
      transparentCorners: true,
    });
    measureLineCircle1.hasControls = false;
    const measureLineCircle2 = new fabric.Circle({
      left: 100,
      top: 170,
      stroke: "#20C3FF",
      radius: 10,
      fill: "",
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
  const findRefrenceLineDistance = (x1, x2, y1, y2) => {
    const _lineLength = Math.hypot(x2 - x1, y2 - y1);
    setRefrenceLineDistance(_lineLength);
  };
  const findMeasureLineDistance = (x1, x2, y1, y2) => {
    const _lineLength = Math.hypot(x2 - x1, y2 - y1);
    setMeasureLineDistance(_lineLength);
  };
  const calculate = () => {
    const measurementInInches =
      (measureLineDistance / refrenceLineDistance) * unit;
    setResult(measurementInInches);
  };
  const rotateLeft = () => {
    try {
      const canvas = canvasRef.current;
      var curAngle = rotateThisImage.angle;
      rotateThisImage.angle = curAngle + 90;
      canvas.renderAll();
    } catch (error) {
      console.log("error", error);
    }
  };
  const rotateRight = () => {
    try {
      const canvas = canvasRef.current;
      var curAngle = rotateThisImage.angle;
      rotateThisImage.angle = curAngle - 90;
      canvas.renderAll();
    } catch (error) {
      console.log("error", error);
    }
  };
  const zoomIN = () => {
    try {
      let ZOOM_PERCENT = 1.2;

      const canvas = canvasRef.current;
      // canvas.setZoom(canvas.getZoom() * 1.1);
      canvas.zoomToPoint(
        new fabric.Point(canvas.width / 2, canvas.height / 2),
        canvas.getZoom() * ZOOM_PERCENT
      );
    } catch (error) {
      console.log("error", error);
    }
  };
  const zoomOut = () => {
    try {
      let ZOOM_PERCENT = 1.2;
      const canvas = canvasRef.current;
      // canvas.setZoom(canvas.getZoom() / 1.1);
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
  const renderActions = () => {
    if (isRotate) {
      return (
        <div
          className={
            isRotate
              ? "m-rotate-actions-container"
              : "m-rotate-actions-container-active"
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
              ? "m-rotate-actions-container"
              : "m-rotate-actions-container-active"
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
              ? "m-rotate-actions-container"
              : "m-rotate-actions-container-active"
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
    <div className="m-mobile-container">
      <div className="m-mobile-header">
        <div className="m-mobile-header-body">
          <div className="m-mobile-header-logo-container">
            <img src={utils.icons.dentelidIcon} alt="logo" />
          </div>
          <div
            className="m-mobile-header-addnew-image"
            onClick={() => inputFileRef.current.click()}
          >
            <img src={utils.icons.newImage} alt="upload" />
            <p>New Image</p>
            <input
              type={"file"}
              ref={inputFileRef}
              style={{ display: "none" }}
              onChange={handelPickFile}
            />
          </div>
        </div>
      </div>
      <div className="m-mobile-result-container">
        <div className="m-mobile-result-body">
          <div className="m-mobile-result-length-scale-container">
            <img src={utils.icons.rotateIcon} alt="rotate icon" />
            <p>Scale Length</p>
            <div className="m-input-container">
              <input type={"text"} onChange={(e) => setUnit(e.target.value)} />
              <span>mm</span>
            </div>
          </div>
          <div className="m-mobile-line-result-container">
            <div className="m-mobile-line-result-body">
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
                <p>{unit.length ? result.toFixed(2) : ""}</p>
                <span>mm</span>
              </div>
            </div>
          </div>
          <div className="m-mobile-line-result-lines">
            <span>
              <img src={utils.icons.refrencelineIcon} alt="refrence line" />
              <span className="m-scale-length">Scale Length</span>
            </span>
            <span>
              <img src={utils.icons.measurelineIcon} alt="measurement line" />
              <span className="m-measurement">Measurement</span>
            </span>
          </div>
        </div>
      </div>
      <div
        id="parent"
        style={{
          height: 310,
          width: "100%",
          marginTop: 20,
          borderRadius: 0,
          //   display: "flex",
          // backgroundColor: "#EEEEF5",
        }}
      >
        <canvas ref={canvasRef} id="canvas" />
      </div>
      <div className="m-mobile-footer">
        <div className="m-mobile-footer-body">
          <div className="m-footer-items">
            <p>Tools</p>
          </div>
          <div
            className="m-footer-items"
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
            className="m-footer-items"
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
          {/* <div className="m-footer-items">
            <img src={utils.icons.colorIcon} alt="color" />
            <p>Color</p>
          </div> */}
          {/* <div className="m-footer-items">
            <img src={utils.icons.contrastIcon} alt="contrast" />
            <p>Contrast</p>
          </div> */}
          <div
            className="m-footer-items"
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
      <div className="m-mobile-footer-animated">{renderActions()}</div>
    </div>
  );
}

export default MobileLineMeasurement;
