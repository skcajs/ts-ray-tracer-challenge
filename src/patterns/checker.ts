import Tuple from "../tuple.ts";
import Pattern from "./pattern.ts";

export default class Checker extends Pattern {

    constructor(public a: Tuple, public b: Tuple) {
        super(a, b);
    }

    protected localColorAt(localPoint: Tuple): Tuple {
        return (Math.floor(localPoint.x) + Math.floor(localPoint.y) + Math.floor(localPoint.z)) % 2 == 0 ? this.a : this.b;
    }

}

export const makeChecker = (a: Tuple, b: Tuple) => {
    return new Checker(a, b)
}