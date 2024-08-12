import Canvas from "./canvas.ts";
import {colour, point} from "./maths/tuple.ts";
import Ray from "./ray.ts";
import Sphere from "./sphere.ts";
import PointLight from "./light.ts";
import {integrator} from "./integrators/basicLighting.ts";

const Renderer = (canvas: Canvas) => {
    const start = (canvasPixels: number = 100) => {
        canvas.setWidth(canvasPixels);
        canvas.setHeight(canvasPixels);

        const image: number[] = []

        const rayOrigin = point(0, 0, -5);
        const wallZ = 10;
        const wallSize = 7;

        const pixelSize = wallSize / canvasPixels;
        const half = wallSize / 2;

        const shape = new Sphere();
        shape.material.color = colour(1, 0.2, 1);

        const light = new PointLight(point(-10, 10, -10), colour(1, 1, 1));

        for (let y = 0; y < canvasPixels; ++y) {
            for (let x = 0; x < canvasPixels; ++x) {
                const r = new Ray(
                    rayOrigin,
                    point(-half + pixelSize * x, half - pixelSize * y, wallZ)
                        .subtract(rayOrigin)
                        .normalize())

                image.push(...integrator(r, shape.intersect(r), light).data());
            }
        }
        canvas.drawImage(image);
    }

    return {start}
}

export default Renderer;