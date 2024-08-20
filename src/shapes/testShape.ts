import Intersection from "../intersection.ts";
import Ray from "../ray.ts";
import Shape from "./shape.ts";
import Tuple, {makeVector} from "../tuple.ts";
import Intersections from "../intersections.ts";
import Sphere from "./sphere.ts";

export default class TestShape extends Shape {
    savedRay?: Ray;

    constructor() {
        super();
    }

    localIntersect(localRay: Ray): Intersections {
        this.savedRay = localRay;
        const i = new Intersection(1, new Sphere())
        return new Intersections(i);
    }

    localNormalAt(localPoint: Tuple): Tuple {
        return makeVector(localPoint.x, localPoint.y, localPoint.z);
    }
}

export function testShape(): TestShape {
    return new TestShape();
}