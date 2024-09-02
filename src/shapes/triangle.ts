import Intersections, {emptyIntersections} from "../intersections.ts";
import Ray from "../ray.ts";
import Tuple, {makePoint} from "../tuple.ts";
import Shape from "./shape.ts";
import Intersection, {makeIntersection} from "../intersection.ts";
import {Bounds} from "../bounds.ts";

export default class Triangle extends Shape {
    e1: Tuple;
    e2: Tuple;
    normal: Tuple;

    constructor(public p1: Tuple, public p2: Tuple, public p3: Tuple) {
        super();
        this.e1 = p2.subtract(p1);
        this.e2 = p3.subtract(p1);
        this.normal = this.e2.cross(this.e1).normalize();
    }

    protected localIntersect(localRay: Ray): Intersections {
        const xs = emptyIntersections();
        const dirCrossE2 = localRay.direction.cross(this.e2);
        const det = this.e1.dot(dirCrossE2);
        if (Math.abs(det) < Number.EPSILON) return xs;

        const f = 1.0 / det;

        const p1ToOrigin = localRay.origin.subtract(this.p1);
        const u = f * p1ToOrigin.dot(dirCrossE2);
        if (u < 0 || u > 1) return xs;
        const originCrossE1 = p1ToOrigin.cross(this.e1);
        const v = f * localRay.direction.dot(originCrossE1);
        if (v < 0 || (u + v) > 1) return xs;

        const t = f * this.e2.dot(originCrossE1);
        xs.push(makeIntersection(t, this, u, v));
        return xs;
    }

    // @ts-ignore
    protected localNormalAt(localPoint: Tuple, i?: Intersection): Tuple {
        return this.normal;
    }

    getBounds(): Bounds {
        const pxMin = Math.min(this.p1.x, this.p2.x, this.p3.x);
        const pyMin = Math.min(this.p1.y, this.p2.y, this.p3.y);
        const pzMin = Math.min(this.p1.z, this.p2.z, this.p3.z);
        const pxMax = Math.max(this.p1.x, this.p2.x, this.p3.x);
        const pyMax = Math.max(this.p1.y, this.p2.y, this.p3.y);
        const pzMax = Math.max(this.p1.z, this.p2.z, this.p3.z);
        return {minimum: makePoint(pxMin, pyMin, pzMin), maximum: makePoint(pxMax, pyMax, pzMax)};
    }
}

export const makeTriangle = (p1: Tuple, p2: Tuple, p3: Tuple) => {
    return new Triangle(p1, p2, p3);
};