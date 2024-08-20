import Intersections from "../intersections.ts";
import Ray from "../ray.ts";
import Tuple, {makeVector} from "../tuple.ts";
import Shape from "./shape.ts";
import {makeIntersection} from "../intersection.ts";

class Plane extends Shape {
    constructor() {
        super();
    }

    protected localIntersect(localRay: Ray): Intersections {
        if (Math.abs(localRay.direction.y) < 1e-5) return new Intersections();
        
        return new Intersections(makeIntersection(-localRay.origin.y / localRay.direction.y, this));
    }

    // @ts-ignore unused localPoint
    protected localNormalAt(localPoint: Tuple): Tuple {
        return makeVector(0, 1, 0);
    }
}

export const makePlane = () => {
    return new Plane();
}