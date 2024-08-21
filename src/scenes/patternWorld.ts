// noinspection DuplicatedCode

import {makeSphere} from "../shapes/sphere.ts";
import {scaling, translation, viewTransform} from "../transformations.ts";
import {material} from "../material.ts";
import {blue, green, makeColor, makePoint, makeVector, purple, red, white} from "../tuple.ts";
import World, {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {makePlane} from "../shapes/plane.ts";
import Matrix from "../matrix.ts";
import {makeStripes} from "../patterns/stripes.ts";
import {makeChecker} from "../patterns/checker.ts";

const patternWorld = (): [World, Matrix] => {

    const floor = makePlane();
    floor.material.pattern = makeChecker(purple(), white());
    floor.material.pattern.setTransform(scaling(1, 1, 1));

    const middle = makeSphere();
    middle.transform = translation(-0.5, 1, 0.5);
    middle.material = material();
    middle.material.color = makeColor(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;
    middle.material.pattern = makeChecker(blue(), red());
    middle.material.pattern.setTransform(scaling(0.5, 0.5, 0.5));

    const right = makeSphere();
    right.transform = translation(1.5, 0.5, -0.5).multiply(scaling(0.5, 0.5, 0.5));
    right.material = material();
    right.material.color = makeColor(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;
    right.material.pattern = makeStripes(blue(), green());
    right.material.pattern.setTransform(scaling(0.25, 0.25, 0.25).rotate(1, -Math.PI / 4))

    const left = makeSphere();
    left.transform = translation(-1.5, 0.33, -0.75).multiply(scaling(0.33, 0.33, 0.33));
    left.material = material();
    left.material.color = makeColor(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(1, 1, 1));
    world.objects = [floor, middle, right, left];

    const transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 1, 0), makeVector(0, 1, 0))

    return [world, transform];
}

export default patternWorld;