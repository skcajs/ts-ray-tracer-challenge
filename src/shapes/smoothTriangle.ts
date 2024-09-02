import Triangle from "./triangle.ts";
import Tuple from "../tuple.ts";
import Intersection from "../intersection.ts";

export default class SmoothTriangle extends Triangle {

    constructor(p1: Tuple, p2: Tuple, p3: Tuple, public n1: Tuple, public n2: Tuple, public n3: Tuple) {
        super(p1, p2, p3);
    }

    // @ts-ignore
    protected localNormalAt(localPoint: Tuple, i: Intersection): Tuple {
        return this.n2.multiply(<number>i.u).add(this.n3.multiply(<number>i.v)).add(this.n1.multiply(1 - <number>i.u - <number>i.v));
    }
}

export const makeSmoothTriangle = (p1: Tuple, p2: Tuple, p3: Tuple, n1: Tuple, n2: Tuple, n3: Tuple) => {
    return new SmoothTriangle(p1, p2, p3, n1, n2, n3);
};