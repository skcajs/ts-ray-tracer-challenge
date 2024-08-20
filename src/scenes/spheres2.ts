// noinspection DuplicatedCode

import {makeSphere} from "../shapes/sphere.ts";
import {scaling, translation, viewTransform} from "../transformations.ts";
import Material from "../material.ts";
import {blue, makeColor, makePoint, makeVector, red} from "../tuple.ts";
import World, {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {makePlane} from "../shapes/plane.ts";
import Matrix from "../matrix.ts";
import {stripePattern} from "../pattern.ts";

const spheresWorld2 = (): [World, Matrix] => {

    const floor = makePlane();

    const middle = makeSphere();
    middle.transform = translation(-0.5, 1, 0.5);
    middle.material = new Material();
    middle.material.color = makeColor(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;
    middle.material.pattern = stripePattern(blue(), red());
    middle.material.pattern.setTransform(scaling(0.5, 1, 1).rotate(2, Math.PI / 3));

    const right = makeSphere();
    right.transform = translation(1.5, 0.5, -0.5).multiply(scaling(0.5, 0.5, 0.5));
    right.material = new Material();
    right.material.color = makeColor(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    const left = makeSphere();
    left.transform = translation(-1.5, 0.33, -0.75).multiply(scaling(0.33, 0.33, 0.33));
    left.material = new Material();
    left.material.color = makeColor(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(1, 1, 1));
    world.objects = [floor, middle, right, left];

    const transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 1, 0), makeVector(0, 1, 0))

    return [world, transform];
}

export default spheresWorld2;