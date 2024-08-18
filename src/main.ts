import './style.css'
import Canvas from './canvas.ts'
import spheres from "./scenes/spheres.ts";
import {camera} from "./camera.ts";
import {viewTransform} from "./maths/transformations.ts";
import {point, vector} from "./maths/tuple.ts";

main();

function main() {
    const canvas = new Canvas(
        document.querySelector<HTMLCanvasElement>('#canvas')!,
        100, 50);

    const scene = spheres();

    const cam = camera(canvas.getWidth(), canvas.getHeight(), Math.PI / 3);
    cam.transform = viewTransform(point(0, 1.5, -5), point(0, 1, 0), vector(0, 1, 0));

    canvas.drawImage(cam.render(scene));
}

