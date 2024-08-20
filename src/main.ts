import './style.css'
import Canvas from './canvas.ts'
import {viewTransform} from "./transformations.ts";
import {makePoint, makeVector} from "./tuple.ts";
import loadScene from "./scenes/scene.ts";
import {makeCamera} from "./camera.ts";

main();

function main() {
    const canvas = new Canvas(
        document.querySelector<HTMLCanvasElement>('#canvas')!,
        800, 400);

    const fast = true;
    const scene = "spheres";

    if (fast) useWorkers(canvas, scene);

    else {
        const world = loadScene(scene);
        const cam = makeCamera(canvas.getWidth(), canvas.getHeight(), Math.PI / 3);
        cam.transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 1, 0), makeVector(0, 1, 0));
        const data = cam.render(world);
        canvas.drawImage(data);
    }
}

function useWorkers(canvas: Canvas, scene: string) {
    const numWorkers = navigator.hardwareConcurrency || 4;
    const chunkSize = Math.ceil(canvas.getHeight() / numWorkers);
    const transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 1, 0), makeVector(0, 1, 0))
    const camData = {
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        fieldOfView: Math.PI / 3,
        transform: transform.e
    };

    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(new URL('./worker.ts', import.meta.url), {type: 'module'});
        const startY = i * chunkSize;

        worker.postMessage({
            startY: startY,
            endY: Math.min(startY + chunkSize, camData.height),
            camData: camData,
            scene: scene
        });

        worker.onmessage = (event) => canvas.drawImage(event.data, startY, chunkSize);
    }
}

