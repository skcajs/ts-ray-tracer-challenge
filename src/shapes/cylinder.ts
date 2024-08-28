import Intersections, {emptyIntersections} from "../intersections.ts";
import Ray from "../ray.ts";
import Tuple, {makeVector} from "../tuple.ts";
import Shape from "./shape.ts";
import {makeIntersection} from "../intersection.ts";

export default class Cylinder extends Shape {

    constructor(public minimum: number, public maximum: number, public closed: boolean) {
        super();
    }

    protected localIntersect(localRay: Ray): Intersections {
        const xs = emptyIntersections();

        const a = localRay.direction.x ** 2 + localRay.direction.z ** 2;

        if (a > Number.EPSILON) {
            const b = 2 * localRay.origin.x * localRay.direction.x + 2 * localRay.origin.z * localRay.direction.z;
            const c = localRay.origin.x ** 2 + localRay.origin.z ** 2 - 1;

            const disc = b ** 2 - (4 * a * c);

            if (disc < 0) return xs;

            let t0 = (-b - Math.sqrt(disc)) / (2 * a);
            let t1 = (-b + Math.sqrt(disc)) / (2 * a);

            if (t0 > t1) [t0, t1] = [t1, t0];

            const y0 = localRay.origin.y + t0 * localRay.direction.y;
            if (this.minimum < y0 && y0 < this.maximum) {
                xs.push(makeIntersection(t0, this));
            }

            const y1 = localRay.origin.y + t1 * localRay.direction.y;
            if (this.minimum < y1 && y1 < this.maximum) {
                xs.push(makeIntersection(t1, this));
            }
        }

        this.intersectCaps(localRay, xs);
        return xs;
    }

    protected localNormalAt(localPoint: Tuple): Tuple {
        const dist = localPoint.x ** 2 + localPoint.z ** 2;
        if (dist < 1 && localPoint.y >= this.maximum - Number.EPSILON) return makeVector(0, 1, 0);
        if (dist < 1 && localPoint.y <= this.minimum + Number.EPSILON) return makeVector(0, -1, 0);
        return makeVector(localPoint.x, 0, localPoint.z);
    }

    private checkCap(localRay: Ray, t: number) {
        const x = localRay.origin.x + t * localRay.direction.x;
        const z = localRay.origin.z + t * localRay.direction.z;

        return x ** 2 + z ** 2 <= 1;
    }

    private intersectCaps(localRay: Ray, xs: Intersections) {
        if (!this.closed || Math.abs(localRay.direction.y) < Number.EPSILON) return;

        let t = (this.minimum - localRay.origin.y) / localRay.direction.y;
        if (this.checkCap(localRay, t)) {
            xs.push(makeIntersection(t, this));
        }

        t = (this.maximum - localRay.origin.y) / localRay.direction.y;
        if (this.checkCap(localRay, t)) {
            xs.push(makeIntersection(t, this));
        }
    };
}

export const makeCylinder = (minimum: number = -Infinity, maximum: number = Infinity, closed = false) => {
    return new Cylinder(minimum, maximum, closed);
};