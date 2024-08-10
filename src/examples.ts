import Canvas from "./canvas.ts";
import {makeBlack, makeColor, makePoint} from "./tuple.ts";
import {rotation, scaling, translation} from "./transformations.ts";
import Ray from "./ray.ts";
import Sphere from "./sphere.ts";
import PointLight from "./light.ts";

const Examples = (canvas: Canvas) => {
    const clock = () => {
        for (let i = 0; i < 12; ++i) {
            const radius = 200;
            const angle = (2 * Math.PI / 12) * i;
            let point = makePoint(0, 0, 0);
            const t = translation(radius * Math.cos(angle), radius * Math.sin(angle), 0);
            point = t.multiplyTuple(point);
            canvas.drawPixel(point.x, point.y, makeColor(1, 0, 1), 4);
        }
    }

    const circle = (canvasPixels: number = 100) => {
        canvas.setWidth(canvasPixels);
        canvas.setHeight(canvasPixels);

        const image: number[] = []

        const rayOrigin = makePoint(0, 0, -5);
        const wallZ = 10;
        const wallSize = 7;

        const pixelSize = wallSize / canvasPixels;
        const half = wallSize / 2;

        const shape = new Sphere();
        shape.material.color = makeColor(1, 0.2, 1);

        shape.transform = scaling(1, -0.3, 1).rotate(0, Math.PI * 2);

        const light = new PointLight(makePoint(-10, 10, -10), makeColor(1, 1, 1));

        for (let y = 0; y < canvasPixels; ++y) {
            const worldY = half - pixelSize * y;
            for (let x = 0; x < canvasPixels; ++x) {
                let color = makeBlack();

                const worldX = -half + pixelSize * x;
                const position = makePoint(worldX, worldY, wallZ);

                const r = new Ray(rayOrigin, position.subtract(rayOrigin).normalize())
                const xs = shape.intersect(r);

                const hit = xs.hit();
                if (hit) {
                    const point = r.position(hit.t);
                    const normal = hit.object.normalAt(point);
                    const eye = r.direction.multiply(-1);
                    color = hit.object.material.lighting(light, point, eye, normal);
                }

                image.push(...color.data());
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