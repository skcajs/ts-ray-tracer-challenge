import Intersections, {emptyIntersections, makeIntersections} from "../intersections.ts";
import Ray from "../ray.ts";
import Tuple, {makeVector} from "../tuple.ts";
import Shape from "./shape.ts";
import {makeIntersection} from "../intersection.ts";

export default class Cube extends Shape {
    constructor() {
        super();
    }

    protected localIntersect(localRay: Ray): Intersections {
        const xBounds = this.checkAxis(localRay.origin.x, localRay.direction.x);
        const yBounds = this.checkAxis(localRay.origin.y, localRay.direction.y);
        const zBounds = this.checkAxis(localRay.origin.z, localRay.direction.z);

        const tMin = Math.max(xBounds[0], yBounds[0], zBounds[0]);
        const tMax = Math.min(xBounds[1], yBounds[1], zBounds[1]);

        if (tMin > tMax) return emptyIntersections();
        return makeIntersections(makeIntersection(tMin, this), makeIntersection(tMax, this));
    }

    protected localNormalAt(localPoint: Tuple): Tuple {
        const maxC = Math.max(Math.abs(localPoint.x), Math.abs(localPoint.y), Math.abs(localPoint.z));
        if (maxC == Math.abs(localPoint.x)) {
            return makeVector(localPoint.x, 0, 0);
        } else if (maxC == Math.abs(localPoint.y)) {
            return makeVector(0, localPoint.y, 0);
        }
        return makeVector(0, 0, localPoint.z);
    }

    private checkAxis(origin: number, direction: number): [number, number] {
        const tMinNumerator = (-1 - origin);
        const tMaxNumerator = 1 - origin;
        let tMin: number;
        let tMax: number;
        if (Math.abs(direction) >= Number.EPSILON) {
            tMin = tMinNumerator / direction;
            tMax = tMaxNumerator / direction;
        } else {
            tMin = tMinNumerator * Infinity;
            tMax = tMaxNumerator * Infinity;
        }

        if (tMin > tMax) return [tMax, tMin];

        return [tMin, tMax];
    }
}

export const makeCube = () => {
    return new Cube();
};