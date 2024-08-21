// noinspection DuplicatedCode

import {makeSphere} from "../shapes/sphere.ts";

import {makeColor, makePoint, makeVector} from "../tuple.ts";
import World, {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {viewTransform} from "../transformations.ts";
import Matrix from "../matrix.ts";


const sphereWorld = (): [World, Matrix] => {

    const sphere = makeSphere();

    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(1, 1, 1));
    world.objects = [sphere];

    const transform = viewTransform(makePoint(0, 0, -5), makePoint(0, 0, 0), makeVector(0, 1, 0))

    return [world, transform];
}

export default sphereWorld;