import Tuple from "../tuple.ts";
import Pattern from "./pattern.ts";

export default class Rings extends Pattern {
    constructor(public a: Tuple, public b: Tuple) {
        super(a, b);
    }

    protected localColorAt(localPoint: Tuple): Tuple {
        return Math.floor(Math.sqrt(localPoint.x ** 2 + localPoint.z ** 2)) % 2 == 0 ? this.a : this.b;
    }
}

export const makeRings = (a: Tuple, b: Tuple) => {
    return new Rings(a, b);
}