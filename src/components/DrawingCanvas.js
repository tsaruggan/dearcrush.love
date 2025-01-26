import React, { useRef, useState, useEffect } from 'react';

function DrawingCanvas({ canvasWidth, canvasHeight, noPosX, noPosY, selectedYes, selectedNo }) {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [drawingActions, setDrawingActions] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  
  const colour = "brown";
  const linewidth = 3;
  const imageSize = 125;

  const yesImageSrc = '/assets/2025/placeholder-yes.png';
  const noImageSrc = '/assets/2025/placeholder-no.png';
  const yesPosX = canvasWidth / 4;
  const yesPosY = canvasHeight / 3;
  const yesImagePos = { x: yesPosX, y: yesPosY };
  const noImagePos = { x: noPosX, y: noPosY };
  const [yesImage, setYesImage] = useState(null);
  const [noImage, setNoImage] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false); // New state to track loading status

  const [circledYes, setCircledYes] = useState(false);
  const [startYes, setStartYes] = useState(null);
  const [circledNo, setCircledNo] = useState(false);
  const [startNo, setStartNo] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
  const SELECTED_THRESHOLD = 10;

  useEffect(() => {
    // Load images and track when they are fully loaded
    const yesImg = new Image();
    const noImg = new Image();
    yesImg.src = yesImageSrc;
    noImg.src = noImageSrc;

    const handleImageLoad = () => {
      // Once both images are loaded, set the state and trigger canvas drawing
      if (yesImg.complete && noImg.complete) {
        setYesImage(yesImg);
        setNoImage(noImg);
        setImagesLoaded(true);  // Set imagesLoaded to true
      }
    };

    yesImg.onload = handleImageLoad;
    noImg.onload = handleImageLoad;

    // Set up the canvas after images are loaded
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      setContext(ctx);
      selectedYes(circledYes);
      selectedNo(circledNo);

      if (imagesLoaded) {
        drawImages(ctx);  // Draw images if they are loaded
      }
    }

    // Cleanup
    return () => {
      // In case the component is unmounted
      yesImg.onload = null;
      noImg.onload = null;
    };
  }, [imagesLoaded, circledYes, circledNo]); // Dependencies

  // Function to draw images on canvas
  const drawImages = (ctx) => {
    if (yesImage && noImage) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas before redrawing
      ctx.drawImage(yesImage, yesImagePos.x - imageSize/2, yesImagePos.y  - imageSize/2, imageSize, imageSize);
      ctx.drawImage(noImage, noImagePos.x  - imageSize/2, noImagePos.y  - imageSize/2, imageSize, imageSize);
    }
  };

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
      setStartPos({x: x, y: y});
      setCurrentPos({x: x, y: y});
    }
  };

  const draw = (e) => {
    if (!drawing || !context) return;

    const { x, y } = getCoordinates(e);
    context.strokeStyle = colour;
    context.lineWidth = linewidth;
    context.lineTo(x, y);
    context.stroke();
    
    setCurrentPos({x: x, y: y})
    checkCircledYes();
    checkCircledNo();
    setCurrentPath((prevPath) => [...prevPath, { x, y }]);
  };

  const endDrawing = () => {
    if (!drawing) return;

    setDrawing(false);
    context.closePath();

    if (currentPath.length > 0) {
      setDrawingActions((prevActions) => [...prevActions, { path: currentPath }]);
    }

    setCurrentPath([]);
  };

  const clearDrawing = () => {
    if (!imagesLoaded) return; // Don't clear until images are loaded

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawImages(ctx);  // Redraw images after clearing
    setDrawingActions([]);
    setCurrentPath([]);
  };

  const checkCircledYes = () => {
    if (startYes === null) {
        if (Math.abs(currentPos.x - yesPosX) < imageSize/2 && Math.abs(currentPos.y - yesPosY) < imageSize/2) {
            setStartYes(getDistance(currentPos, yesImagePos));
            setStartNo(null);
            console.log("START YES");
        }
    } else if (getDistance(currentPos, yesImagePos) > startYes + SELECTED_THRESHOLD) {
        setStartYes(null)
    } else {
        if (getDistance(currentPos, startPos) < SELECTED_THRESHOLD) {
            setCircledYes(true)
            console.log("CIRCLED YES");
        }
    }
  }

  const checkCircledNo = () => {
    if (startNo === null) {
        if (Math.abs(currentPos.x - noPosX) < imageSize/2 && Math.abs(currentPos.y - noPosY) < imageSize/2) {
            setStartNo(getDistance(currentPos, noImagePos));
            setStartYes(null);
            console.log("START NO");
        }
    } else if (getDistance(currentPos, noImagePos) > startNo + SELECTED_THRESHOLD) {
        setStartNo(null)
    } else {
        if (getDistance(currentPos, startPos) < SELECTED_THRESHOLD) {
            setCircledNo(true)
            console.log("CIRCLED NO");
        }
    }
  }

  const getDistance = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
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
      />
    </div>
  );
}

export default DrawingCanvas;
