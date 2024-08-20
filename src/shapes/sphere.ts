import Ray from "../ray.ts";
import Tuple, {makePoint, makeVector} from "../tuple.ts";
import {makeIntersection} from "../intersection.ts";
import Intersections from "../intersections.ts";
import Matrix from "../matrix.ts";
import Shape from "./shape.ts";

export default class Sphere extends Shape {

    constructor(public origin: Tuple = makePoint(0, 0, 0), public radius: number = 1.0) {
        super();
    }

    setTransform(t: Matrix) {
        this.transform = t;
    }

    localIntersect(localRay: Ray): Intersections {
        const sphereToRay = localRay.origin.subtract(this.origin);

        const a = localRay.direction.dot(localRay.direction);
        const b = 2 * localRay.direction.dot(sphereToRay);
        const c = sphereToRay.dot(sphereToRay) - 1;

        const discriminant = Math.pow(b, 2) - 4 * a * c;
        if (discriminant < 0) return new Intersections();

        return new Intersections(
            makeIntersection((-b - Math.sqrt(discriminant)) / (2 * a), this),
            makeIntersection((-b + Math.sqrt(discriminant)) / (2 * a), this)
        );
    }

    localNormalAt(localPoint: Tuple): Tuple {
        return makeVector(localPoint.x, localPoint.y, localPoint.z);
    }
}

export const makeSphere = () => {
    return new Sphere();
}