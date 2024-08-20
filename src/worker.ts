import {makeCamera} from "./camera.ts";
import loadScene from "./scenes/scene.ts";

self.onmessage = (event) => {

    const {startY, endY, camData, scene} = event.data;

    const [world, transform] = loadScene(scene);

    const cam = makeCamera(camData.width, camData.height, camData.fieldOfView);
    cam.transform = transform;

    self.postMessage(cam.renderChunk(world, startY, endY));
};