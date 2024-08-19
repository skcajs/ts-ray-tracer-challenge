import './style.css'
import Canvas from './canvas.ts'
import {viewTransform} from "./maths/transformations.ts";
import {point, vector} from "./maths/tuple.ts";

main();

function main() {
    const canvas = new Canvas(
        document.querySelector<HTMLCanvasElement>('#canvas')!,
        100, 50);

    const numWorkers = navigator.hardwareConcurrency || 4;
    const chunkSize = Math.ceil(canvas.getHeight() / numWorkers);

    const transform = viewTransform(point(0, 1.5, -5), point(0, 1, 0), vector(0, 1, 0))

    const camData = {
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        fieldOfView: Math.PI / 3,
        transform: transform.elements
    };

    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(new URL('./worker.ts', import.meta.url), {type: 'module'});
        const startY = i * chunkSize;

        worker.postMessage({
            startY: startY,
            endY: Math.min(startY + chunkSize, camData.height),
            camData: camData,
        });

        worker.onmessage = (event) => canvas.drawImage(event.data, startY);
    }


}

