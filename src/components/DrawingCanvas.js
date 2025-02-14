import React, { useRef, useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

function DrawingCanvas({ onYes }) {
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
  const GIF_SIZE = 360; // max height of before gif
  const GIF_PADDING = 24; // padding above before gif

  // states corresponding to whether yes or no are circled
  const [circledYes, setCircledYes] = useState(false);
  const [startYes, setStartYes] = useState(null);
  const [circledNo, setCircledNo] = useState(false);
  const [startNo, setStartNo] = useState(null);

  // const [startPath, setStartPath] = useState(null);

  // constants related to circle selection
  const SELECTED_THRESHOLD = IMAGE_SIZE / 3; // closeness threshold for closing circle
  const ALIGN_THRESHOLD = IMAGE_SIZE / 2; // threshold for aligning circle centre
  const PATH_SAMPLING = 2; // sample list of points on path (optimization)
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
    initializeImagePositions(canvas.width, canvas.height);
    
    setContext(ctx);
  }

  const initializeImagePositions = (canvasWidth, canvasHeight) => {
    const yPosition = Math.max(canvasHeight / 2, GIF_SIZE + GIF_PADDING + IMAGE_SIZE / 2);
    const xPositionYes = canvasWidth * 3 / 10;
    const xPositionNo = canvasWidth * 7 / 10;
    setYesImagePos({ x: xPositionYes, y: yPosition });
    setNoImagePos({ x: xPositionNo, y: yPosition });
  }


  const drawImages = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!context || !yesImage || !noImage || !yesImagePos || !noImagePos) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw images at their fixed positions based on canvas size
    ctx.drawImage(yesImage, yesImagePos.x - IMAGE_SIZE / 2, yesImagePos.y - IMAGE_SIZE / 2, IMAGE_SIZE, IMAGE_SIZE);
    ctx.drawImage(noImage, noImagePos.x - IMAGE_SIZE / 2, noImagePos.y - IMAGE_SIZE / 2, IMAGE_SIZE, IMAGE_SIZE);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reset initial positions
    initializeImagePositions(canvas.width, canvas.height);
  }

  useEffect(() => {
    const setup = async () => {
      await loadImages();
      await loadCanvas()
    };
    setup();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (context && yesImage && noImage && yesImagePos && noImagePos) {
      drawImages();
    }
  }, [context, yesImage, noImage, yesImagePos, noImagePos]);

  // tells you where your cursor currently is drawing
  const getDrawingCoordinates = (e) => {
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
      const { x, y } = getDrawingCoordinates(e);
      context.beginPath();
      context.moveTo(x, y);

      // set drawing state
      setDrawing(true);
      setIntersected(false);
      setCurrentPath([]);
      setCurrentPos({ x: x, y: y });
    }
  };

  const draw = (e) => {
    if (!drawing || !context) return;
    // console.log("drawing");

    const { x, y } = getDrawingCoordinates(e);
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
    } else {
      const distance = getDistance(currentPos, currentPath[0]);
      if (currentPath.length > MIN_PATH && distance < SELECTED_THRESHOLD) {
        if (compareAverage(currentPath, yesImagePos)) {
          console.log("CIRCLED YES")
          setCircledYes(true);
          onYes();
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
    } else {
      const distance = getDistance(currentPos, currentPath[0]);
      if (currentPath.length > MIN_PATH && distance < SELECTED_THRESHOLD) {
        if (compareAverage(currentPath, noImagePos)) {
          console.log("CIRCLED NO");
          setCircledNo(true);
          shuffleNoImagePosition();
        }
      }
    }
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

  const shuffleNoImagePosition = () => {
    const canvas = canvasRef.current;

    const randomizeCoordinates = () => {
      let randomX = Math.random() * (canvas.width - IMAGE_SIZE) + IMAGE_SIZE / 2;
      let randomY = Math.random() * (canvas.height - GIF_SIZE - GIF_PADDING - IMAGE_SIZE / 2) + GIF_SIZE + GIF_PADDING;
      return { x: randomX, y: randomY };
    }

    let newNoImagePos = randomizeCoordinates();
    while (getDistance(newNoImagePos, yesImagePos) <= IMAGE_SIZE * 1.25) {
      newNoImagePos = randomizeCoordinates();
    }

    setNoImagePos(newNoImagePos);
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
