import Tuple from "./maths/tuple.ts";

export default class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, canvasWidth: number, canvasHeight: number) {
        this.canvas = canvas;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.ctx = ctx;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.ctx.fillStyle = 'rgb(0,0,0)'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    getWidth() {
        return this.canvas.width;
    }

    getHeight() {
        return this.canvas.height;
    }

    setWidth(width: number) {
        this.canvas.width = width;
    }

    setHeight(height: number) {
        this.canvas.height = height;
    }

    drawPixel(x: number, y: number, color: Tuple, pixelSize: number = 1) {
        const imageData = this.ctx.createImageData(pixelSize, pixelSize); // 1x1 pixel
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = color.r * 255;     // Red channel
            data[i + 1] = color.g * 255; // Green channel
            data[i + 2] = color.b * 255; // Blue channel
            data[i + 3] = color.a * 255; // Alpha channel
        }
        this.ctx.putImageData(imageData, x + (this.canvas.width / 2), y + (this.canvas.height / 2));
    }

    drawImage(image: number[], dy: number = 0, chunkSize: number = this.getHeight()) {
        const imageData = this.ctx.createImageData(this.getWidth(), chunkSize);
        imageData.data.set(image);
        this.ctx.putImageData(imageData, 0, dy);
    }
}