import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import ChatUI from "./ChatUI";
import { GenerateText } from "../lib/model";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const InteractiveNotebook: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [brushSize, setBrushSize] = useState(5);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [isErasing, setIsErasing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageInlineData, setImageInlineData] = useState<any | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines(ctx);
        drawLetters(ctx);
      }
    }
  }, [currentPage]); // Draw only default content here

  const drawLines = (ctx: CanvasRenderingContext2D) => {
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

  const drawLetters = (ctx: CanvasRenderingContext2D) => {
    ctx.font = "54px Arial";
    ctx.fillStyle = "black";
    const letterWidth = ctx.canvas.width / 4;
    const startIndex = currentPage * 4;
    for (let i = 0; i < 4; i++) {
      const letter = ALPHABET[startIndex + i] || "";
      ctx.fillText(letter, i * letterWidth + letterWidth / 2 - 40, 40);
    }
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

  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(ALPHABET.length / 4) - 1)
    );
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const generateFeedBack = async (base64: string) => {
    try {
      // Send the Base64 image to Gemini AI
      console.log("Sending image to lama I...");

      const aiResponse = await GenerateText(base64);
      console.log(aiResponse);

      // Update the messages with the AI response
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     key: prevMessages.length + 1,
      //     text: aiResponse.message,
      //     isUser: false,
      //   },
      // ]);
    } catch (error) {
      console.error("Error sending image to Gemini AI:", error);
    }
  };

  const captureCanvas = () => {
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
    const mimeType = base64Image.split(";")[0].split(":")[1];
    generateFeedBack(base64Data);
    // setImageSrc(base64Image);
    // setIsChatOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="relative" ref={imageRef}>
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
          <canvas
            ref={canvasRef}
            width={800}
            height={480}
            className="absolute top-0 left-0 pointer-events-none"
          />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Button onClick={prevPage} disabled={currentPage === 0}>
            Previous Page
          </Button>
          <Button onClick={clearCanvas}>Clear Page</Button>
          <Button
            onClick={nextPage}
            disabled={currentPage === Math.ceil(ALPHABET.length / 4) - 1}
          >
            Next Page
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-between">
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
          <button onClick={captureCanvas}>Capture Canvas</button>
        </div>
        <p className="mt-2 text-center text-gray-600">Page {currentPage + 1}</p>
      </div>
      <div
        className="fixed bottom-12 right-12 cursor-pointer"
        onClick={() => setIsChatOpen(true)}
      >
        <img
          src="/shin-chan.gif"
          className=" rounded-2xl w-36 h-96"
          alt="Shin-chan"

          width={350}
          height={150}
        />
      </div>
      {isChatOpen && (
        <ChatUI
          imageSrc={imageSrc || ""}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default InteractiveNotebook;
