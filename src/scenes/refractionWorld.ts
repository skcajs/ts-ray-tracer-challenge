// noinspection DuplicatedCode

import {glassSphere} from "../shapes/sphere.ts";

import {black, blue, makeColor, makePoint, makeVector, purple, white} from "../tuple.ts";
import World, {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {scaling, translation, viewTransform} from "../transformations.ts";
import Matrix from "../matrix.ts";
import {makePlane} from "../shapes/plane.ts";
import {makeChecker} from "../patterns/checker.ts";
import {material} from "../material.ts";


const refractionWorld = (): [World, Matrix] => {

    const floor = makePlane();
    floor.material.pattern = makeChecker(white(), black());
    floor.material.reflective = 1.0;
    floor.material.transparency = 1.0;
    floor.material.refractiveIndex = 1.5;

    const wall = makePlane();
    wall.setTransform(translation(0, 20, 0).rotate(0, Math.PI / 2));
    wall.material.pattern = makeChecker(white(), blue());
    wall.material.pattern.setTransform(scaling(0.5, 0.5, 0.5).rotate(1, Math.PI / 2));
    wall.material.reflective = 0.9;
    wall.material.refractiveIndex = 1.5;

    const wall2 = makePlane();
    wall2.setTransform(translation(0, -20, 0).rotate(0, Math.PI / 2));
    wall2.material.pattern = makeChecker(white(), blue());
    wall2.material.pattern.setTransform(scaling(0.5, 0.5, 0.5).rotate(1, Math.PI / 2));
    wall2.material.reflective = 0.9;
    wall2.material.refractiveIndex = 1.5;


    const sphere = glassSphere();
    sphere.material = material();
    sphere.material.color = purple();
    sphere.material.diffuse = 0.7;
    sphere.material.specular = 0.3;
    sphere.material.reflective = 0.8;
    sphere.material.refractiveIndex = 2.5;


    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(0.5, 0.5, 0.5));
    world.objects = [floor, wall, wall2, sphere];

    const transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 1, 0), makeVector(0, 1, 0));

    return [world, transform];
};

export default refractionWorld;
