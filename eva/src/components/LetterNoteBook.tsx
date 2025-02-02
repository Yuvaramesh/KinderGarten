"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const InteractiveNotebook: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        drawLines(ctx);
        drawLetters(ctx);
      }
    }
  }, []); // Removed currentPage from dependencies

  const drawLines = (ctx: CanvasRenderingContext2D) => {
    const lineHeight = 50;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.moveTo(0, i * lineHeight * 4 + j * lineHeight);
        ctx.lineTo(ctx.canvas.width, i * lineHeight * 4 + j * lineHeight);
        ctx.strokeStyle = j === 0 || j === 3 ? "red" : "blue";
        ctx.stroke();
      }
    }
  };

  const drawLetters = (ctx: CanvasRenderingContext2D) => {
    ctx.font = "60px Arial";
    ctx.fillStyle = "gray";
    const letterWidth = ctx.canvas.width / 4;
    const startIndex = currentPage * 4;
    for (let i = 0; i < 4; i++) {
      const letter = ALPHABET[startIndex + i] || "";
      ctx.fillText(letter, i * letterWidth + letterWidth / 2 - 20, 90);
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
    const canvas = canvasRef.current;
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
    const canvas = canvasRef.current;
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
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines(ctx);
        drawLetters(ctx);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border border-gray-300 rounded touch-none"
        />
        <div className="mt-4 flex justify-between">
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
        <p className="mt-2 text-center text-gray-600">Page {currentPage + 1}</p>
      </div>
    </div>
  );
};

export default InteractiveNotebook;
