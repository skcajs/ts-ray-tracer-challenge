import {objToGroup, parseObjectFile} from "../shapes/parser.ts";
import World, {emptyWorld} from "../world.ts";
import PointLight from "../light.ts";
import {makeColor, makePoint, makeVector} from "../tuple.ts";
import {viewTransform} from "../transformations.ts";
import teapot from "../test/data/teapot.txt?raw";
import Matrix from "../matrix.ts";

const teapotWorld = (): [World, Matrix] => {
    const parser = parseObjectFile(teapot);
    const group = objToGroup(parser);

    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(1, 1, 1));
    world.objects = [group];

    const transform = viewTransform(makePoint(-30, -30, -30), makePoint(0, 0, 0), makeVector(0, 1, 0));

    return [world, transform];
};

export default teapotWorld;