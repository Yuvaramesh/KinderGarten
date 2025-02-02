import type React from "react"
import { useRef, useState, useEffect } from "react"
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
  const [isLetterPractice, setIsLetterPractice] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawLines(ctx)
        if (isLetterPractice) {
          drawLetters(ctx)
        } else {
          drawDefaultLines(ctx)
        }
      }
    }
  }, [isLetterPractice, currentPage])

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

  const drawDefaultLines = (ctx: CanvasRenderingContext2D) => {
    const firstRedLineY = 2
    const secondBlueLineY = 40
    const lineGap = 10
    const canvasWidth = ctx.canvas.width
    const canvasHeight = ctx.canvas.height

    ctx.lineWidth = 3
    ctx.strokeStyle = "#333333"

    ctx.beginPath()
    ctx.moveTo(0, firstRedLineY)
    ctx.lineTo(canvasWidth * 0.25, secondBlueLineY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvasWidth * 0.25, firstRedLineY)
    ctx.lineTo(canvasWidth * 0.5, secondBlueLineY)
    ctx.stroke()

    ctx.beginPath()
    const centerX = canvasWidth * 0.75
    ctx.moveTo(centerX, firstRedLineY)
    ctx.lineTo(centerX, secondBlueLineY)
    ctx.stroke()

    ctx.beginPath()
    const centerY = (firstRedLineY + secondBlueLineY) / 2
    ctx.moveTo(canvasWidth * 0.5, centerY)
    ctx.lineTo(canvasWidth * 0.75, centerY)
    ctx.stroke()

    ctx.fillStyle = "#999999"
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j < 4; j++) {
        ctx.beginPath()
        ctx.arc(canvasWidth * (i * 0.25 + 0.125), j * lineGap, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.font = "14px Arial"
    ctx.fillStyle = "#666666"
    ctx.fillText("Right Slant", 10, 4 * lineGap + 15)
    ctx.fillText("Left Slant", canvasWidth * 0.25 + 10, 4 * lineGap + 15)
    ctx.fillText("Straight", canvasWidth * 0.5 + 10, 4 * lineGap + 15)
    ctx.fillText("Horizontal", canvasWidth * 0.75 + 10, 4 * lineGap + 15)
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
    if (isLetterPractice) {
      setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(ALPHABET.length / 4) - 1))
    }
  }

  const prevPage = () => {
    if (isLetterPractice) {
      setCurrentPage((prev) => Math.max(0, prev - 1))
    }
  }

  const togglePracticeType = () => {
    setIsLetterPractice((prev) => !prev)
    setCurrentPage(0)
    clearCanvas()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="relative">
          <canvas ref={canvasRef} width={800} height={480} className="absolute top-0 left-0 pointer-events-none" />
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
          <Button onClick={prevPage} disabled={!isLetterPractice || currentPage === 0}>
            Previous Page
          </Button>
          <Button onClick={clearCanvas}>Clear Page</Button>
          <Button onClick={nextPage} disabled={!isLetterPractice || currentPage === Math.ceil(ALPHABET.length / 4) - 1}>
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
        <div className="mt-4 flex justify-center">
          <Button onClick={togglePracticeType}>
            Switch to {isLetterPractice ? "Line Practice" : "Letter Practice"}
          </Button>
        </div>
        <p className="mt-2 text-center text-gray-600">
          {isLetterPractice ? `Letter Practice - Page ${currentPage + 1}` : "Line Practice"}
        </p>
      </div>
    </div>
  )
}

export default InteractiveNotebook
