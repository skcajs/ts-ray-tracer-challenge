import Sphere from "../shapes/sphere.ts";
import {rotation, scaling, translation} from "../transformations.ts";
import Material from "../material.ts";
import {makeColor, makePoint} from "../tuple.ts";
import {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";

const sphereWorld = () => {

    const floor = new Sphere();
    floor.transform = scaling(10, 0.1, 10);
    floor.material = new Material();
    floor.material.color = makeColor(1, 0.9, 0.9);
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
    middle.material.color = makeColor(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;

    const right = new Sphere();
    right.transform = translation(1.5, 0.5, -0.5).multiply(scaling(0.5, 0.5, 0.5));
    right.material = new Material();
    right.material.color = makeColor(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    const left = new Sphere();
    left.transform = translation(-1.5, 0.33, -0.75).multiply(scaling(0.33, 0.33, 0.33));
    left.material = new Material();
    left.material.color = makeColor(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(1, 1, 1));
    world.objects = [floor, leftWall, rightWall, middle, right, left];

    return world;
}

export default sphereWorld;