// components/DrawingCanvas.js
import React, { useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const DrawingCanvas = () => {
  // Create a ref to access the canvas methods
  const canvasRef = useRef();

  const clearCanvas = () => {
    canvasRef.current.clearCanvas();  // Clears the canvas
  };

  const undoCanvas = () => {
    canvasRef.current.undo();  // Undo the last drawing action
  };

  const saveCanvas = () => {
    const image = canvasRef.current.exportImage('png');  // Export canvas as PNG image
    console.log(image); // You can send this image URL to a server or download it
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Draw on the Canvas</h1>

      {/* Add the ReactSketchCanvas component */}
      <ReactSketchCanvas
        ref={canvasRef}
        width="500px"
        height="500px"
        strokeColor="black"  // Default brush color
        strokeWidth={5}      // Default brush thickness
        backgroundColor="white"
      />

      {/* Buttons to clear, undo, or save */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={clearCanvas}>Clear Canvas</button>
        <button onClick={undoCanvas}>Undo</button>
        <button onClick={saveCanvas}>Save Drawing</button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
