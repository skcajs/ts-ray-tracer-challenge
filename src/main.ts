import './style.css'
import Canvas from './canvas.ts'
import {viewTransform} from "./maths/transformations.ts";
import {point, vector} from "./maths/tuple.ts";

main();

function main() {
    const canvas = new Canvas(
        document.querySelector<HTMLCanvasElement>('#canvas')!,
        100, 50);

    const worker = new Worker(new URL('./worker.ts', import.meta.url), {type: 'module'});

    const transform = viewTransform(point(0, 1.5, -5), point(0, 1, 0), vector(0, 1, 0))

    worker.postMessage({
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        fieldOfView: Math.PI / 3,
        transform: transform.elements
    });

    worker.onmessage = (event) => canvas.drawImage(event.data);
}

