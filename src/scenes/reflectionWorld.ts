// noinspection DuplicatedCode

import {makeSphere} from "../shapes/sphere.ts";

import {black, blue, makeColor, makePoint, makeVector, purple, red, white} from "../tuple.ts";
import World, {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {scaling, translation, viewTransform} from "../transformations.ts";
import Matrix from "../matrix.ts";
import {makePlane} from "../shapes/plane.ts";
import {makeChecker} from "../patterns/checker.ts";
import {material} from "../material.ts";
import {makeStripes} from "../patterns/stripes.ts";


const reflectionWorld = (): [World, Matrix] => {

    const floor = makePlane();
    floor.material.pattern = makeChecker(white(), black());
    floor.material.reflective = 0.5;

    const wall = makePlane();
    wall.setTransform(translation(0, 5, 0).rotate(0, Math.PI / 2));
    wall.material.pattern = makeStripes(white(), purple());
    wall.material.pattern.setTransform(scaling(0.5, 0.5, 0.5).rotate(1, Math.PI / 2));
    wall.material.reflective = 0.2;

    const sphere = makeSphere();
    sphere.transform = translation(-0.5, 1, 0.5);
    sphere.material = material();
    sphere.material.color = makeColor(0.1, 1, 0.5);
    sphere.material.diffuse = 0.7;
    sphere.material.specular = 0.3;
    sphere.material.pattern = makeChecker(blue(), red());
    sphere.material.pattern.setTransform(scaling(0.5, 0.5, 0.5));
    sphere.material.reflective = 0.1;


    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(0.5, 0.5, 0.5));
    world.objects = [floor, wall, sphere];

    const transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 1, 0), makeVector(0, 1, 0));

    return [world, transform];
};

export default reflectionWorld;

