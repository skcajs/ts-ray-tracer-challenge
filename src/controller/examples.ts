import Canvas from "../canvas.ts";
import {makeColor, makePoint} from "../tuple.ts";
import {translation} from "../transformations.ts";
import Ray from "../ray.ts";
import Sphere from "../sphere.ts";

const Examples = (canvas: Canvas) => {
    const clock = () => {
        for (let i = 0; i < 12; ++i) {
            const radius = 200;
            const angle = (2 * Math.PI / 12) * i;
            let point = makePoint(0, 0 ,0);
            const t = translation(radius * Math.cos(angle), radius * Math.sin(angle), 0);
            point = t.multiplyTuple(point);
            canvas.drawPixel(point.x, point.y, makeColor(1,0,1), 4);
        }
    }

    const circle = (canvasPixels: number = 100) => {
        canvas.setWidth(canvasPixels);
        canvas.setHeight(canvasPixels);

        const image: number[] = []

        const rayOrigin = makePoint(0,0,-5);
        const wallZ = 10;
        const wallSize = 7;

        const pixelSize = wallSize / canvasPixels;
        const half = wallSize / 2;

        const purple = makeColor(1,0,1).data();
        const black = makeColor(0,0,0).data();
        const shape = new Sphere();

        for (let y = 0; y < canvasPixels; ++y) {
            const worldY = half - pixelSize * y;
            for (let x = 0; x < canvasPixels; ++x) {
                const worldX = -half + pixelSize * x;
                const position = makePoint(worldX, worldY, wallZ);

                const r = new Ray(rayOrigin, position.subtract(rayOrigin).normalize())
                const xs = shape.intersect(r);

                const color = xs.hit() ? purple : black;

                image.push(...color);
            }
        }
        canvas.drawImage(image);
    }

    return {
        clock,
        circle
    }
}

export default Examples;