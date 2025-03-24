"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";

interface Stroke {
  id: string;
  name: string;
  description: string;
  drawFunction: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
}

const strokes: Stroke[] = [
  {
    id: "right-slant",
    name: "Right Slant (\\)",
    description:
      "Draw from top-left to bottom-right. Used in letters like 'v', 'w', 'y'.",
    drawFunction: (ctx, x, y, width, height) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);
      ctx.stroke();
    },
  },
  {
    id: "left-slant",
    name: "Left Slant (/)",
    description:
      "Draw from top-right to bottom-left. Used in letters like 'v', 'w', 'x'.",
    drawFunction: (ctx, x, y, width, height) => {
      ctx.beginPath();
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y + height);
      ctx.stroke();
    },
  },
  {
    id: "straight",
    name: "Straight Line (|)",
    description:
      "Draw from top to bottom. Used in letters like 'b', 'd', 'h', 'l'.",
    drawFunction: (ctx, x, y, width, height) => {
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y);
      ctx.lineTo(x + width / 2, y + height);
      ctx.stroke();
    },
  },
  {
    id: "horizontal",
    name: "Horizontal Line (—)",
    description: "Draw from left to right. Used in letters like 'e', 'f', 't'.",
    drawFunction: (ctx, x, y, width, height) => {
      ctx.beginPath();
      ctx.moveTo(x, y + height / 2);
      ctx.lineTo(x + width, y + height / 2);
      ctx.stroke();
    },
  },
  {
    id: "left-parenthesis",
    name: "Left Parenthesis ((",
    description:
      "Draw a curve that opens to the right. Used in parentheses and letters like 'c', 'e'.",
    drawFunction: (ctx, x, y, width, height) => {
      ctx.beginPath();
      ctx.moveTo(x + width * 0.6, y);
      ctx.quadraticCurveTo(x, y + height / 2, x + width * 0.6, y + height);
      ctx.stroke();
    },
  },
  {
    id: "right-parenthesis",
    name: "Right Parenthesis ())",
    description:
      "Draw a curve that opens to the left. Used in parentheses and letters like 'd', 'b'.",
    drawFunction: (ctx, x, y, width, height) => {
      ctx.beginPath();
      ctx.moveTo(x + width * 0.4, y);
      ctx.quadraticCurveTo(
        x + width,
        y + height / 2,
        x + width * 0.4,
        y + height
      );
      ctx.stroke();
    },
  },

  {
    id: "hook",
    name: "Hook (ɾ)",
    description: "Draw a hook shape. Used in letters like 'r', 'n', 'm'.",
    drawFunction: (ctx, x, y, width, height) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + height * 0.7);
      ctx.quadraticCurveTo(
        x + width * 0.3,
        y + height,
        x + width,
        y + height * 0.7
      );
      ctx.stroke();
    },
  },
];

const StrokeTeachingPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [isErasing, setIsErasing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke>(strokes[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawNotebookLines(ctx);
        drawStrokeExamples(ctx);
      }
    }
  }, [currentStroke]);

  const drawNotebookLines = (ctx: CanvasRenderingContext2D) => {
    const rowHeight = 120;
    const lineGap = 20;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.moveTo(0, i * rowHeight + j * lineGap);
        ctx.lineTo(ctx.canvas.width, i * rowHeight + j * lineGap);
        ctx.lineWidth = 2;
        ctx.strokeStyle = j === 0 || j === 3 ? "red" : "blue";
        ctx.stroke();
      }
    }
  };

  const drawStrokeExamples = (ctx: CanvasRenderingContext2D) => {
    const rowHeight = 60;
    const lineGap = 0;
    const sectionWidth = ctx.canvas.width / 4;

    // Draw the current stroke in the first row
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#333333";

    // Draw the stroke in each section of the first row
    for (let i = 0; i < 4; i++) {
      currentStroke.drawFunction(
        ctx,
        i * sectionWidth + 20,
        lineGap,
        sectionWidth - 40,
        rowHeight - 2 * lineGap
      );
    }

    // Add section labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "#666666";
    ctx.fillText(currentStroke.name, 10, 4 * lineGap + 75);
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = tempCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = tempCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if ("touches" in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      ctx.lineWidth = brushSize;
      if (isErasing) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.strokeStyle = drawingColor;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = tempCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Learn Basic Strokes</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{currentStroke.name}</h3>
        <p className="mb-4">{currentStroke.description}</p>
      </div>

      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="absolute top-0 left-0 pointer-events-none"
        />
        <canvas
          ref={tempCanvasRef}
          width={800}
          height={480}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border border-gray-300 rounded"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {strokes.map((stroke) => (
          <Button
            key={stroke.id}
            onClick={() => setCurrentStroke(stroke)}
            variant={currentStroke.id === stroke.id ? "default" : "outline"}
          >
            {stroke.name}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button onClick={clearCanvas}>Clear Canvas</Button>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            Brush Size:
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="ml-2"
            />
          </label>
          <label className="flex items-center">
            Color:
            <input
              type="color"
              value={drawingColor}
              onChange={(e) => setDrawingColor(e.target.value)}
              className="ml-2"
            />
          </label>
          <Button onClick={() => setIsErasing((prev) => !prev)}>
            {isErasing ? "Switch to Brush" : "Eraser"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StrokeTeachingPage;
