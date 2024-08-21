import Tuple from "../tuple.ts";
import Pattern from "./pattern.ts";

export default class Gradient extends Pattern {
    constructor(public a: Tuple, public b: Tuple) {
        super(a, b);
    }

    protected localColorAt(localPoint: Tuple): Tuple {
        return this.a.add(this.b.subtract(this.a).multiply(localPoint.x - Math.floor(localPoint.x)));
    }

}

export const makeGradient = (a: Tuple, b: Tuple) => {
    return new Gradient(a, b);
}