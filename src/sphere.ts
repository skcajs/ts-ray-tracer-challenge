import Ray from "./ray.ts";
import Tuple, {point, vector} from "./maths/tuple.ts";
import Intersection from "./intersection.ts";
import Intersections from "./intersections.ts";
import Matrix from "./maths/matrix.ts";
import {makeMaterial} from "./material.ts";

export default class Sphere {

    transform;
    material;

    constructor(public origin: Tuple = point(0, 0, 0), public radius: number = 1.0) {
        this.transform = Matrix.Identity();
        this.material = makeMaterial();
    }

    intersect(ray: Ray): Intersections {
        const rayT = ray.transform(this.transform.inverse());
        const sphereToRay = rayT.origin.subtract(this.origin);

        const a = rayT.direction.dot(rayT.direction);
        const b = 2 * rayT.direction.dot(sphereToRay);
        const c = sphereToRay.dot(sphereToRay) - 1;

        const discriminant = Math.pow(b, 2) - 4 * a * c;
        if (discriminant < 0) return new Intersections();

        return new Intersections(
            new Intersection((-b - Math.sqrt(discriminant)) / (2 * a), this),
            new Intersection((-b + Math.sqrt(discriminant)) / (2 * a), this)
        );
    }

    setTransform(t: Matrix) {
        this.transform = t;
    }

    normalAt(p: Tuple): Tuple {
        const pObject = this.transform.inverse().multiplyTuple(p);
        const pObjectNormal = pObject.subtract(this.origin);
        const pWorld = this.transform.inverse().transpose().multiplyTuple(pObjectNormal);
        return vector(pWorld.x, pWorld.y, pWorld.z).normalize();
    }
}