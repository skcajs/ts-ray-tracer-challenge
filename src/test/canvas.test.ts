import { expect, test, vi } from 'vitest'
import Canvas from "../canvas.ts";

// Mocking the CanvasRenderingContext2D
const mockContext = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn().mockReturnValue({data: [0, 0, 0, 1]}),
    putImageData: vi.fn(),
    createImageData: vi.fn().mockReturnValue({ width: 0, height: 0 }),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
} as unknown as CanvasRenderingContext2D;

// Mocking the HTMLCanvasElement
const mockCanvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => mockContext)
} as unknown as HTMLCanvasElement;

test('Creating a canvas', () => {
    const canvas = new Canvas(mockCanvas, 10, 10)
    expect(canvas.getWidth()).toBe(10);
    expect(canvas.getHeight()).toBe(10);
})