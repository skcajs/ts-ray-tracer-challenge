import Tuple from "./tuple.ts";
import Matrix from "./matrix.ts";

export default class Ray {

    constructor(public origin: Tuple, public direction: Tuple) {
    }

    position(t: number) {
        return this.origin.add(this.direction.multiply(t));
    }

    transform(matrix: Matrix): Ray {
        return new Ray(matrix.multiplyTuple(this.origin), matrix.multiplyTuple(this.direction));
    }
}

export function makeRay(origin: Tuple, direction: Tuple) {
    return new Ray(origin, direction);
}