import './style.css'
import Canvas from './canvas.ts'
import loadScene from "./scenes/scene.ts";
import {makeCamera} from "./camera.ts";

main();

function main() {
    const canvas = new Canvas(
        document.querySelector<HTMLCanvasElement>('#canvas')!,
        400, 200);

    const fast = true;
    const scene = "spheres2";

    if (fast) useWorkers(canvas, scene);

    else {
        const [world, transform] = loadScene(scene);
        const cam = makeCamera(canvas.getWidth(), canvas.getHeight(), Math.PI / 3);
        cam.transform = transform;
        const data = cam.render(world);
        canvas.drawImage(data);
    }
}

function useWorkers(canvas: Canvas, scene: string) {
    const numWorkers = navigator.hardwareConcurrency || 4;
    const chunkSize = Math.ceil(canvas.getHeight() / numWorkers);
    const camData = {
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        fieldOfView: Math.PI / 3
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

