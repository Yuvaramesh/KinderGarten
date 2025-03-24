import type React from "react";
import { useRef, useEffect } from "react";

interface LinePracticePageProps {
  width: number;
  height: number;
}

const LinePracticePage: React.FC<LinePracticePageProps> = ({
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        drawLines(ctx);
        drawDefaultLines(ctx);
      }
    }
  }, []);

  const drawLines = (ctx: CanvasRenderingContext2D) => {
    const rowHeight = 120;
    const lineGap = 20;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.moveTo(0, i * rowHeight + j * lineGap);
        ctx.lineTo(ctx.canvas.width, i * rowHeight + j * lineGap);
        ctx.strokeStyle = j === 0 || j === 3 ? "red" : "blue";
        ctx.stroke();
      }
    }
  };

  const drawDefaultLines = (ctx: CanvasRenderingContext2D) => {
    const rowHeight = 120;
    const lineGap = 20;
    const sectionWidth = ctx.canvas.width / 4;

    // Right slanting line \
    ctx.beginPath();
    ctx.moveTo(0, lineGap);
    ctx.lineTo(sectionWidth, rowHeight - lineGap);
    ctx.stroke();

    // Left slanting line /
    ctx.beginPath();
    ctx.moveTo(sectionWidth, lineGap);
    ctx.lineTo(sectionWidth * 2, rowHeight - lineGap);
    ctx.stroke();

    // Straight line |
    ctx.beginPath();
    ctx.moveTo(sectionWidth * 2.5, lineGap);
    ctx.lineTo(sectionWidth * 2.5, rowHeight - lineGap);
    ctx.stroke();

    // Sleeping line ---
    ctx.beginPath();
    ctx.moveTo(sectionWidth * 3, (rowHeight - lineGap) / 2);
    ctx.lineTo(sectionWidth * 4, (rowHeight - lineGap) / 2);
    ctx.stroke();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 rounded touch-none"
    />
  );
};

export default LinePracticePage;
