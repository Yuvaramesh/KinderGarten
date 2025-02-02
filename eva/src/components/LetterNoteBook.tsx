import React, { useRef, useState, useEffect } from "react"
import { Button } from "./ui/button"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const InteractiveNotebook: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tempCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [brushSize, setBrushSize] = useState(5)
  const [drawingColor, setDrawingColor] = useState("#000000")
  const [isErasing, setIsErasing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawLines(ctx)
        drawLetters(ctx)
      }
    }
  }, [currentPage]) // Draw only default content here

  const drawLines = (ctx: CanvasRenderingContext2D) => {
    const rowHeight = 120
    const lineGap = 20
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        ctx.beginPath()
        ctx.moveTo(0, i * rowHeight + j * lineGap)
        ctx.lineTo(ctx.canvas.width, i * rowHeight + j * lineGap)
        ctx.lineWidth = 2
        ctx.strokeStyle = j === 0 || j === 3 ? "red" : "blue"
        ctx.stroke()
      }
    }
  }

  const drawLetters = (ctx: CanvasRenderingContext2D) => {
    ctx.font = "54px Arial"
    ctx.fillStyle = "black"
    const letterWidth = ctx.canvas.width / 4
    const startIndex = currentPage * 4
    for (let i = 0; i < 4; i++) {
      const letter = ALPHABET[startIndex + i] || ""
      ctx.fillText(letter, i * letterWidth + letterWidth / 2 - 40, 40)
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = tempCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.beginPath()
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = tempCanvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect()
      let x, y
      if ("touches" in e) {
        x = e.touches[0].clientX - rect.left
        y = e.touches[0].clientY - rect.top
      } else {
        x = e.clientX - rect.left
        y = e.clientY - rect.top
      }

      ctx.lineWidth = brushSize
      if (isErasing) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.globalCompositeOperation = "source-over"
      } else {
        ctx.strokeStyle = drawingColor
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const clearCanvas = () => {
    const canvas = tempCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(ALPHABET.length / 4) - 1))
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="relative">
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
        <div className="mt-4 flex justify-between items-center">
          <Button onClick={prevPage} disabled={currentPage === 0}>
            Previous Page
          </Button>
          <Button onClick={clearCanvas}>Clear Page</Button>
          <Button onClick={nextPage} disabled={currentPage === Math.ceil(ALPHABET.length / 4) - 1}>
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
        </div>
        <p className="mt-2 text-center text-gray-600">Page {currentPage + 1}</p>
      </div>
    </div>
  )
}

export default InteractiveNotebook
