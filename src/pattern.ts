import Tuple from "./tuple.ts";

export default class Pattern {
    constructor(public a: Tuple, public b: Tuple) {
    }

    colorAt(pos: Tuple): Tuple {
        return Math.floor(pos.x) % 2 == 0 ? this.a : this.b;
    }
}

export const stripePattern = (a: Tuple, b: Tuple) => {
    return new Pattern(a, b);
}