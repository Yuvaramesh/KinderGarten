
import type React from "react"
import { useRef, useEffect } from "react"

interface LinePracticePageProps {
    width: number
    height: number
}

const LinePracticePage: React.FC<LinePracticePageProps> = ({ width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.lineJoin = "round"
                ctx.lineCap = "round"
                ctx.lineWidth = 2
                drawLines(ctx)
                drawDefaultLines(ctx)
            }
        }
    }, [])

    const drawLines = (ctx: CanvasRenderingContext2D) => {
        const rowHeight = 120
        const lineGap = 20
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                ctx.beginPath()
                ctx.moveTo(0, i * rowHeight + j * lineGap)
                ctx.lineTo(ctx.canvas.width, i * rowHeight + j * lineGap)
                ctx.strokeStyle = j === 0 || j === 3 ? "red" : "blue"
                ctx.stroke()
            }
        }
    }
    const drawDefaultLines = (ctx: CanvasRenderingContext2D) => {
        const firstRedLineY = 20;
        const secondBlueLineY = 60;
        const sectionWidth = ctx.canvas.width / 4;

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#333333";

        ctx.beginPath();
        ctx.moveTo(0, firstRedLineY);
        ctx.lineTo(sectionWidth, secondBlueLineY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(sectionWidth, firstRedLineY);
        ctx.lineTo(sectionWidth * 2, secondBlueLineY);
        ctx.stroke();

        ctx.beginPath();
        const centerX = sectionWidth * 2.5;
        ctx.moveTo(centerX, firstRedLineY);
        ctx.lineTo(centerX, secondBlueLineY);
        ctx.stroke();

        ctx.beginPath();
        const centerY = (firstRedLineY + secondBlueLineY) / 2;
        ctx.moveTo(sectionWidth * 2, centerY);
        ctx.lineTo(sectionWidth * 3, centerY);
        ctx.stroke();
    };


    return <canvas ref={canvasRef} width={width} height={height} className="border border-gray-300 rounded touch-none" />
}

export default LinePracticePage

