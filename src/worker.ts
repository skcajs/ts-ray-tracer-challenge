import {camera} from "./camera.ts";
import spheres from "./scenes/spheres.ts";
import Matrix from "./maths/matrix.ts";

self.onmessage = (event) => {

    const {width, height, fieldOfView, transform} = event.data;

    const world = spheres();

    const cam = camera(width, height, fieldOfView);
    cam.transform = new Matrix(transform);

    self.postMessage(cam.render(world));
};