import {objToGroup, parseObjectFile} from "../shapes/parser.ts";
import World, {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {makeColor, makePoint, makeVector} from "../tuple.ts";
import {translation, viewTransform} from "../transformations.ts";
import teapot from "../test/data/teapot.txt?raw";
import Matrix from "../matrix.ts";

const teapotWorld = (): [World, Matrix] => {
    const parser = parseObjectFile(teapot);
    const teapotGroup = objToGroup(parser, true);
    teapotGroup.setTransform(translation(0, -1.5, 0));

    const world = emptyWorld();
    world.light = new PointLight(makePoint(-20, 20, -20), makeColor(1, 1, 1));
    world.objects = [teapotGroup];

    const transform = viewTransform(makePoint(0, 0, -10), makePoint(0, 0, 0), makeVector(0, 1, 0));

    return [world, transform];
};

export default teapotWorld;