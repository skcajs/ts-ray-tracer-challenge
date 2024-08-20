import './style.css'
import Canvas from './canvas.ts'
import {viewTransform} from "./transformations.ts";
import {makePoint, makeVector} from "./tuple.ts";

main();

function main() {
    const canvas = new Canvas(
        document.querySelector<HTMLCanvasElement>('#canvas')!,
        400, 200);

    const numWorkers = navigator.hardwareConcurrency || 4;
    const chunkSize = Math.ceil(canvas.getHeight() / numWorkers);
    const transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 1, 0), makeVector(0, 1, 0))
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

        worker.onmessage = (event) => canvas.drawImage(event.data, startY, chunkSize);
    }
}

