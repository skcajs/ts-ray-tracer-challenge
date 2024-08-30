import Tuple from "../tuple.ts";
import Shape from "../shapes/shape.ts";
import Matrix, {identity} from "../matrix.ts";

export default abstract class Pattern {
    transform: Matrix = identity();

    protected constructor(public a: Tuple, public b: Tuple) {
    }

    setTransform(t: Matrix) {
        this.transform = t;
    }

    colorAt(worldPoint: Tuple, object: Shape) {
        const objectPoint = object.worldToObject(worldPoint);
        const patternPoint = this.transform.inverse().multiplyTuple(objectPoint);

        return this.localColorAt(patternPoint);
    }

    protected abstract localColorAt(localPoint: Tuple): Tuple;
}


