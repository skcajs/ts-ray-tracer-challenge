import World, {emptyWorld} from "../world.ts";
import Matrix from "../matrix.ts";
import {makeSphere} from "../shapes/sphere.ts";
import {rotation, scaling, viewTransform} from "../transformations.ts";
import {makeCylinder} from "../shapes/cylinder.ts";
import {makeGroup} from "../shapes/group.ts";
import PointLight from "../light.ts";
import {makeColor, makePoint, makeVector} from "../tuple.ts";

const hexagonWorld = (): [World, Matrix] => {
    const hexagonCorner = () => {
        const corner = makeSphere();
        corner.setTransform(scaling(0.25, 0.25, 0.25).translate(0, 0, -1));
        return corner;
    };

    const hexagonEdge = () => {
        const edge = makeCylinder();
        edge.minimum = 0;
        edge.maximum = 1;
        edge.setTransform(scaling(0.25, 1, 0.25).rotate(2, -Math.PI / 2).rotate(1, -Math.PI / 6).translate(0, 0, -1));
        return edge;
    };

    const hexagonSide = () => {
        const side = makeGroup();
        side.push(hexagonCorner());
        side.push(hexagonEdge());
        return side;
    };

    const hexagon = () => {
        const hex = makeGroup();
        for (let i = 0; i < 6; ++i) {
            const side = hexagonSide();
            side.setTransform(rotation(1, i * Math.PI / 3));
            hex.push(side);
        }
        return hex;
    };

    const world = emptyWorld();
    world.light = new PointLight(makePoint(-10, 10, -10), makeColor(0.8, 0.8, 0.8));
    world.objects = [hexagon()];

    const transform = viewTransform(makePoint(0, 1.5, -5), makePoint(0, 0, 0), makeVector(0, 1, 0));

    return [world, transform];
};

export default hexagonWorld;