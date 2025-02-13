import React, { useRef, useState, useEffect } from 'react';
import styles from "@/styles/2025.module.css";

function DrawingCanvas({ selectedYes, selectedNo }) {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);

  // coordinates relating to existing drawing and active cursor
  const [currentPath, setCurrentPath] = useState([]);
  const [currentPos, setCurrentPos] = useState(null);
  const [intersected, setIntersected] = useState(false);
  const COLOUR = "brown";
  const LINEWIDTH = 3;
  const IMAGE_SIZE = 125; // dimension of yes/no image

  // states corresponding to whether yes or no are circled
  const [circledYes, setCircledYes] = useState(false);
  const [startYes, setStartYes] = useState(null);
  const [circledNo, setCircledNo] = useState(false);
  const [startNo, setStartNo] = useState(null);

  // constants related to circle selection
  const SELECTED_THRESHOLD = IMAGE_SIZE / 5; // closeness threshold for closing circle
  const ALIGN_THRESHOLD = IMAGE_SIZE / 3; // threshold for aligning circle centre
  const PATH_SAMPLING = 3; // sample list of points on path (optimization)
  const MIN_PATH = IMAGE_SIZE * 0.6; // minimum length of path to be a circle
  const INTERSECTION_THRESHOLD = 8; // closeness threshold to consider intersection

  // yes / no image positioning
  const yesImageSrc = '/assets/2025/yes.png';
  const noImageSrc = '/assets/2025/no.png';
  const [yesImage, setYesImage] = useState(null);
  const [noImage, setNoImage] = useState(null);
  const [yesImagePos, setYesImagePos] = useState(null);
  const [noImagePos, setNoImagePos] = useState(null);

  const loadImages = async () => {
    const yesImg = new Image();
    const noImg = new Image();

    // Wrap image loading in a Promise
    const loadImage = (img, src) => {
      return new Promise((resolve) => {
        img.src = src;
        img.onload = () => resolve(img);
      });
    };

    // Wait for both images to load
    const loadedYesImage = await loadImage(yesImg, yesImageSrc);
    const loadedNoImage = await loadImage(noImg, noImageSrc);

    // Set the images after they are loaded
    setYesImage(loadedYesImage);
    setNoImage(loadedNoImage);
  };

  const loadCanvas = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set initial positions
    const yPosition = Math.max(canvas.height / 2 - IMAGE_SIZE / 2, 360 + IMAGE_SIZE / 2);
    const xPositionYes = canvas.width * 3 / 10 - IMAGE_SIZE / 2;
    const xPositionNo = canvas.width * 7 / 10 - IMAGE_SIZE / 2;
    setYesImagePos({ x: xPositionYes, y: yPosition });
    setNoImagePos({ x: xPositionNo, y: yPosition });

    setContext(ctx);
  }

  const drawImages = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (context && yesImage && noImage && yesImagePos && noImagePos) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw images at fixed size without scaling
      ctx.drawImage(yesImage, yesImagePos.x, yesImagePos.y, IMAGE_SIZE, IMAGE_SIZE);
      ctx.drawImage(noImage, noImagePos.x, noImagePos.y, IMAGE_SIZE, IMAGE_SIZE);
    }
  };

  useEffect(() => {
    const setup = async () => {
      await loadImages();
      await loadCanvas()
    };
    setup();
  }, []);

  useEffect(() => {
    if (context && yesImage && noImage && yesImagePos && noImagePos) {
      drawImages();
    }
  }, [context, yesImage, noImage, yesImagePos, noImagePos]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
    }
  };

  const initSelection = () => {
    setCircledYes(false);
    setStartYes(null);
    setCircledNo(false);
    setStartNo(null);
  }

  const startDrawing = (e) => {
    if (context) {
      initSelection();
      const { x, y } = getCoordinates(e);
      context.beginPath();
      context.moveTo(x, y);
      setDrawing(true);
      setIntersected(false);
      setCurrentPath([]);
      setCurrentPos({ x: x, y: y });
    }
  };

  const draw = (e) => {
    if (!drawing || !context) return;

    const { x, y } = getCoordinates(e);
    context.strokeStyle = COLOUR;
    context.lineWidth = LINEWIDTH;
    context.lineTo(x, y);
    context.stroke();

    setCurrentPos({ x: x, y: y })
    checkCircledYes();
    checkCircledNo();
    setCurrentPath((prevPath) => [...prevPath, { x, y }]);
  };

  const endDrawing = () => {
    if (!drawing) return;

    setDrawing(false);
    context.closePath();

    setCurrentPath([]);
  };

  const clearDrawing = () => {
    if (!imagesLoaded) return; // Don't clear until images are loaded

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawImages(ctx);  // Redraw images after clearing
    setCurrentPath([]);
  };

  const checkCircledYes = () => {
    if (startYes === null) {
      if (Math.abs(currentPos.x - yesImagePos.x) < IMAGE_SIZE / 2 && Math.abs(currentPos.y - yesImagePos.y) < IMAGE_SIZE / 2) {
        setStartYes(getDistance(currentPos, yesImagePos));
        setStartNo(null);
      }
    } else if (!intersected) {
      checkIntersected();
    } else {
      const distance = getDistance(currentPos, currentPath[0]);
      if (currentPath.length > MIN_PATH && distance < SELECTED_THRESHOLD) {
        if (compareAverage(currentPath, yesImagePos)) {
          setCircledYes(true)
        }
      }
    }
  }

  const checkCircledNo = () => {
    if (startNo === null) {
      if (Math.abs(currentPos.x - noImagePos.x) < IMAGE_SIZE / 2 && Math.abs(currentPos.y - noImagePos.y) < IMAGE_SIZE / 2) {
        setStartNo(getDistance(currentPos, noImagePos));
        setStartYes(null);
      }
    } else if (!intersected) {
      checkIntersected();
    } else {
      const distance = getDistance(currentPos, currentPath[0]);
      if (currentPath.length > MIN_PATH && distance < SELECTED_THRESHOLD) {
        if (compareAverage(currentPath, noImagePos)) {
          setCircledNo(true)
        }
      }
    }
  }

  const checkIntersected = () => {
    let sampledPath = currentPath.slice(0, -5).filter((_, index) => index % PATH_SAMPLING === 0);
    const intersection = sampledPath.some((pathValue) => {
      return Math.abs(pathValue.x - currentPos.x) < INTERSECTION_THRESHOLD && Math.abs(pathValue.y - currentPos.y) < INTERSECTION_THRESHOLD
    });
    if (intersection) { setIntersected(true); }
  }

  const compareAverage = (currentPath, targetPos) => {
    const xSum = currentPath.reduce((accumulator, pathValue) => accumulator + pathValue.x, 0);
    const xAvg = xSum / currentPath.length;
    const isAlignedX = Math.abs(xAvg - targetPos.x) < ALIGN_THRESHOLD;

    const ySum = currentPath.reduce((accumulator, pathValue) => accumulator + pathValue.y, 0);
    const yAvg = ySum / currentPath.length;
    const isAlignedY = Math.abs(yAvg - targetPos.y) < ALIGN_THRESHOLD;
    return isAlignedX && isAlignedY
  }

  const getDistance = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={clearDrawing}
        onTouchCancel={endDrawing}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{
          touchAction: 'none',
        }}
        className={styles.fullPageCanvas}
      />
    </div>
  );
}

export default DrawingCanvas;
