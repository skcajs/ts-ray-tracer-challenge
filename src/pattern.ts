import Tuple from "./tuple.ts";
import Shape from "./shapes/shape.ts";
import Matrix, {identity} from "./matrix.ts";

export default class Pattern {
    transform: Matrix = identity();

    constructor(public a: Tuple, public b: Tuple) {
    }

    setTransform(t: Matrix) {
        this.transform = t;
    }

    colorAt(pos: Tuple): Tuple {
        return Math.floor(pos.x) % 2 == 0 ? this.a : this.b;
    }

    colorAtObject(worldPoint: Tuple, object: Shape) {
        const objectPoint = object.transform.inverse().multiplyTuple(worldPoint);
        const patternPoint = this.transform.inverse().multiplyTuple(objectPoint);

        return this.colorAt(patternPoint);
    }
}

export const stripePattern = (a: Tuple, b: Tuple) => {
    return new Pattern(a, b);
}