"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { geminiVision } from "@/lib/gemini-vision";
import i18n from "@/i18n/i18n";
import ChatUI from "./ChatUI";

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

interface Message {
  key: number;
  text?: string;
  image?: string;
  isUser?: boolean;
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
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const radius = Math.min(width, height) / 2;

      ctx.beginPath();
      // Draw left half of a circle (from top to bottom, clockwise)
      ctx.arc(centerX, centerY, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
      ctx.stroke();
    },
  },
  {
    id: "right-parenthesis",
    name: "Right Parenthesis ())",
    description:
      "Draw a curve that opens to the left. Used in parentheses and letters like 'd', 'b'.",
    drawFunction: (ctx, x, y, width, height) => {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const radius = Math.min(width, height) / 2;

      ctx.beginPath();
      // Draw right half of a circle: from top (1.5π) to bottom (0.5π)
      ctx.arc(centerX, centerY, radius, 1.5 * Math.PI, 0.5 * Math.PI, false);
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

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

  const generateFeedBack = async (base64: string) => {
    try {
      // Send the Base64 image to Gemini AI
      console.log("Sending image to lama I...");

      const aiResponse = await geminiVision("", base64, i18n.language);

      // Update the messages with the AI response
      return aiResponse;
    } catch (error) {
      console.error("Error sending image to Gemini AI:", error);
    }
  };

  const captureCanvas = async () => {
    const tempCanvas = tempCanvasRef.current;
    const mainCanvas = canvasRef.current;

    // Create a new canvas to merge the content
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = 800; // Set the same width as your canvases
    mergedCanvas.height = 480; // Set the same height as your canvases
    const mergedContext = mergedCanvas.getContext("2d");
    // Draw the first canvas onto the merged canvas
    mergedContext?.drawImage(tempCanvas!, 0, 0);

    // Draw the second canvas onto the merged canvas
    mergedContext?.drawImage(mainCanvas!, 0, 0);

    // Capture the merged canvas as a Base64 image
    const base64Image = mergedCanvas.toDataURL("image/png"); // Base64 data URL
    const base64Data = base64Image.split(",")[1]; // Remove the "data:image/png;base64," prefix

    // Step 1: Add image-only message
    setMessages((prev) => {
      const newMessage = {
        key: prev.length,
        image: base64Image,
        isUser: true,
        text: "", // initially empty
      };
      return [...prev, newMessage];
    });
    setIsChatOpen(true);
    // Step 2: Generate response and update the last message
    const res = await generateFeedBack(base64Data);

    setMessages((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        text: res,
        isUser: false,
      },
    ]);
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
            variant={currentStroke.id === stroke.id ? "default" : "secondary"}
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
          <Button variant={"secondary"} onClick={captureCanvas}>
            Feedback
          </Button>
        </div>
      </div>
      <div
        className="fixed bottom-12 right-12 cursor-pointer"
        onClick={() => setIsChatOpen(true)}
      >
        <img
          src="/shin-chan.gif"
          className=" rounded-2xl w-24 h-24"
          alt="Shin-chan"
          width={150}
          height={150}
        />
      </div>
      {isChatOpen && (
        <ChatUI messages={messages} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
};

export default StrokeTeachingPage;
