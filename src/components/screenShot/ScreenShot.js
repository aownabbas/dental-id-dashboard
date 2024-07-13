import React, { useRef, useState } from "react";
import { useScreenshot, createFileName } from "use-react-screenshot";
const ScreenShot = () => {
  const screenShotRef = useRef(null);
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });
  const download = (
    image,
    { name = "screen shot", extension = "jpg" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () =>
    takeScreenshot(screenShotRef.current).then(download);
  return <div>ScreenShot</div>;
};

export default ScreenShot;
