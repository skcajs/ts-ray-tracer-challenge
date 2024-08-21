import Tuple from "../tuple.ts";
import Pattern from "./pattern.ts";

export default class Checker extends Pattern {

    constructor(public a: Tuple, public b: Tuple) {
        super(a, b);
    }

    protected localColorAt(localPoint: Tuple): Tuple {
        return Math.floor(Math.sqrt(localPoint.x ** 2 + localPoint.y ** 2 + localPoint.z ** 2)) % 2 == 0 ? this.a : this.b;
    }

}

export const makeChecker = (a: Tuple, b: Tuple) => {
    return new Checker(a, b)
}