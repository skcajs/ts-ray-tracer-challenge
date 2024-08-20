import {makeCamera} from "./camera.ts";
import spheres from "./scenes/spheres.ts";
import Matrix from "./matrix.ts";

self.onmessage = (event) => {

    const {startY, endY, camData} = event.data;

    const world = spheres();

    const cam = makeCamera(camData.width, camData.height, camData.fieldOfView);
    cam.transform = new Matrix(camData.transform);

    self.postMessage(cam.renderChunk(world, startY, endY));
};