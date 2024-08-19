import {camera} from "./camera.ts";
import spheres from "./scenes/spheres.ts";
import Matrix from "./maths/matrix.ts";

self.onmessage = (event) => {

    const {startY, endY, camData} = event.data;

    const world = spheres();

    const cam = camera(camData.width, camData.height, camData.fieldOfView);
    cam.transform = new Matrix(camData.transform);

    self.postMessage(cam.renderChunk(world, startY, endY));
};