import {identity} from "./transformations.ts";
import Ray from "./ray.ts";
import {point} from "./tuple.ts";
import World from "./world.ts";

class Camera {
    halfWidth;
    halfHeight;
    pixelSize;
    transform;

    constructor(public hSize: number, public vSize: number, public fieldOfView: number) {
        this.transform = identity();

        const halfView = Math.tan(this.fieldOfView / 2);
        const aspect = this.hSize / this.vSize;
        if (aspect >= 1) {
            this.halfWidth = halfView;
            this.halfHeight = halfView / aspect;
        } else {
            this.halfWidth = halfView * aspect;
            this.halfHeight = halfView;
        }
        this.pixelSize = this.halfWidth * 2 / this.hSize;
    }

    rayForPixel(px: number, py: number): Ray {
        const xOffset = (px + 0.5) * this.pixelSize;
        const yOffset = (py + 0.5) * this.pixelSize;

        const worldX = this.halfWidth - xOffset;
        const worldY = this.halfHeight - yOffset;

        const pixel = this.transform.inverse().multiplyTuple(point(worldX, worldY, -1));
        const origin = this.transform.inverse().multiplyTuple(point(0, 0, 0));
        const direction = pixel.subtract(origin).normalize();

        return new Ray(origin, direction);
    }

    render(world: World): number[] {
        const image: number[] = []

        for (let y = 0; y < this.vSize; y++) {
            for (let x = 0; x < this.hSize; x++) {
                image.push(...world.colorAt(this.rayForPixel(x, y)).data());
            }
        }
        return image;
    };

    renderChunk(world: World, startY: number, endY: number): number[] {
        const image: number[] = []

        for (let y = startY; y < endY; y++) {
            for (let x = 0; x < this.hSize; x++) {
                image.push(...world.colorAt(this.rayForPixel(x, y)).data());
            }
        }
        return image;
    };
}

export const camera = (hSize: number, vSize: number, fieldOfView: number) => {
    return new Camera(hSize, vSize, fieldOfView);
}

export type {Camera};