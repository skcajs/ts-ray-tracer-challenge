import Pattern from "./pattern.ts";
import Tuple, {black, makeColor, white} from "../tuple.ts";

export default class TestPattern extends Pattern {
    constructor(public a: Tuple, public b: Tuple) {
        super(a, b);
    }

    protected localColorAt(localPoint: Tuple): Tuple {
        return makeColor(localPoint.r, localPoint.g, localPoint.b);
    }
}

export const makeTestPattern = () => {
    return new TestPattern(white(), black());
}