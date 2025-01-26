import React, { useRef, useState, useEffect } from 'react';

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [drawingActions, setDrawingActions] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const colour = "brown";
  const linewidth = 3;

  useEffect(() => {
    if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        setContext(ctx);
        reDrawPreviousData(ctx);
    }
  }, []);

  // Helper function to get coordinates for both mouse and touch events
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect(); 
      if (e.touches) {
      // For touch events
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
    } else {
        // For mouse events
        return {
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
        };
    }
  };

  const startDrawing = (e) => {
    if (context) {
        const { x, y } = getCoordinates(e);
        context.beginPath();
        context.moveTo(x, y)
        setDrawing(true);
    }
  }

  const draw = (e) => {
    if (!drawing) return;
    if (context) {
        const { x, y } = getCoordinates(e);
        context.strokeStyle = colour;
        context.linewidth = linewidth;
        context.lineTo(x, y);
        context.stroke();
        setCurrentPath([...currentPath, { x: x, y: y }])
    }
  };

  const endDrawing = () => {
    setDrawing(false);
    context && context.closePath();
    if (currentPath.length > 0) {
        setDrawingActions([...drawingActions, {path: currentPath}])
    }
    setCurrentPath([]);
  };

  const clearDrawing = () => {
    setDrawingActions([]);
    setCurrentPath([]);
    const newContext = canvasRef.current.getContext('2d');
    newContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const reDrawPreviousData = (ctx) => {
    drawingActions.forEach((path) => {
        ctx.beginPath();
        ctx.strokeStyle = colour;
        ctx.linewidth = linewidth;
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
    });
  };

  return (
    <div>
      <h1>Drawing Canvas</h1>
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
