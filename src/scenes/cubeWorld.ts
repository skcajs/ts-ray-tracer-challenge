// noinspection DuplicatedCode
import {makeColor, makePoint, makeVector, purple} from "../tuple.ts";
import World, {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {translation, viewTransform} from "../transformations.ts";
import Matrix from "../matrix.ts";

import {makeCube} from "../shapes/cube.ts";

const cubeWorld = (): [World, Matrix] => {

    const cube = makeCube();
    cube.setTransform(translation(0, 1.5, 0).scale(0.5, 0.5, 0.5).rotate(1, Math.PI / 8));
    cube.material.color = purple();


    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(0.8, 0.8, 0.8));
    world.objects = [cube];

    const transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 1, 0), makeVector(0, 1, 0));

    return [world, transform];
};

export default cubeWorld;
