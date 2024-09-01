// noinspection DuplicatedCode

import Intersections, {emptyIntersections} from "../intersections.ts";
import Ray from "../ray.ts";
import Tuple, {makePoint, makeVector} from "../tuple.ts";
import Shape from "./shape.ts";
import {makeIntersection} from "../intersection.ts";
import {Bounds} from "../bounds.ts";

export default class Cone extends Shape {

    constructor(public minimum: number, public maximum: number, public closed: boolean) {
        super();
    }

    protected localIntersect(localRay: Ray): Intersections {
        const xs = emptyIntersections();

        const a = localRay.direction.x ** 2 - localRay.direction.y ** 2 + localRay.direction.z ** 2;
        const b = 2 * localRay.origin.x * localRay.direction.x - 2 * localRay.origin.y * localRay.direction.y + 2 * localRay.origin.z * localRay.direction.z;
        const c = localRay.origin.x ** 2 - localRay.origin.y ** 2 + localRay.origin.z ** 2;

        if (Math.abs(a) < Number.EPSILON && Math.abs(b) > Number.EPSILON) {
            xs.push(makeIntersection(-c / (2 * b), this));
        } else if (Math.abs(a) > Number.EPSILON) {
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
        let y = Math.sqrt(localPoint.x ** 2 + localPoint.z ** 2);
        if (localPoint.y > 0) y = -y;
        return makeVector(localPoint.x, y, localPoint.z);
    }

    private checkCap(localRay: Ray, t: number, r: number) {
        const x = localRay.origin.x + t * localRay.direction.x;
        const z = localRay.origin.z + t * localRay.direction.z;

        return x ** 2 + z ** 2 <= Math.abs(r);
    }

    private intersectCaps(localRay: Ray, xs: Intersections) {
        if (!this.closed || Math.abs(localRay.direction.y) < Number.EPSILON) return;

        let t = (this.minimum - localRay.origin.y) / localRay.direction.y;
        if (this.checkCap(localRay, t, this.minimum)) {
            xs.push(makeIntersection(t, this));
        }

        t = (this.maximum - localRay.origin.y) / localRay.direction.y;
        if (this.checkCap(localRay, t, this.maximum)) {
            xs.push(makeIntersection(t, this));
        }
    };

    getBounds(): Bounds {
        return {minimum: makePoint(-1, this.minimum, -1), maximum: makePoint(1, this.maximum, 1)};
    }
}

export const makeCone = (minimum: number = -Infinity, maximum: number = Infinity, closed = false) => {
    return new Cone(minimum, maximum, closed);
};