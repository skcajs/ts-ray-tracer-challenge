import Pattern from "./pattern.ts";
import Tuple from "../tuple.ts";

class Stripes extends Pattern {
    constructor(public a: Tuple, public b: Tuple) {
        super(a, b);
    }

    protected localColorAt(localPoint: Tuple): Tuple {
        return Math.floor(localPoint.x) % 2 == 0 ? this.a : this.b;
    }
}

export const makeStripes = (a: Tuple, b: Tuple) => {
    return new Stripes(a, b);
}