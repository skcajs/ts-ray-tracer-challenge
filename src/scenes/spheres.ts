import Canvas from "../canvas.ts";
import Sphere from "../sphere.ts";
import {rotation, scaling, translation, viewTransform} from "../maths/transformations.ts";
import Material from "../material.ts";
import {colour, point, vector} from "../maths/tuple.ts";
import {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {camera} from "../camera.ts";

const sphereScene = (canvas: Canvas) => {

    const floor = new Sphere();
    floor.transform = scaling(10, 0.1, 10);
    floor.material = new Material();
    floor.material.color = colour(1, 0.9, 0.9);
    floor.material.specular = 0;

    const leftWall = new Sphere();
    leftWall.transform = translation(0, 0, 5)
        .multiply(rotation(1, -Math.PI / 4))
        .multiply(rotation(0, -Math.PI / 2))
        .multiply(scaling(10, 0.01, 10));
    leftWall.material = floor.material;

    const rightWall = new Sphere();
    rightWall.transform = translation(0, 0, 5)
        .multiply(rotation(1, Math.PI / 4))
        .multiply(rotation(0, Math.PI / 2))
        .multiply(scaling(10, 0.01, 10));
    rightWall.material = floor.material;

    const middle = new Sphere();
    middle.transform = translation(-0.5, 1, 0.5);
    middle.material = new Material();
    middle.material.color = colour(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;

    const right = new Sphere();
    right.transform = translation(1.5, 0.5, -0.5).multiply(scaling(0.5, 0.5, 0.5));
    right.material = new Material();
    right.material.color = colour(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    const left = new Sphere();
    left.transform = translation(-1.5, 0.33, -0.75).multiply(scaling(0.33, 0.33, 0.33));
    left.material = new Material();
    left.material.color = colour(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    const world = emptyWorld();
    world.light = new PointLight(point(-10, 10, -10), colour(1, 1, 1));
    world.objects = [floor, leftWall, rightWall, middle, right, left];

    const cam = camera(canvas.getWidth(), canvas.getHeight(), Math.PI / 3);
    cam.transform = viewTransform(point(0, 1.5, -5), point(0, 1, 0), vector(0, 1, 0));

    canvas.drawImage(cam.render(world));
}

export default sphereScene;