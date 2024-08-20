import Matrix from "../matrix.ts";
import Material, {material} from "../material.ts";
import Ray from "../ray.ts";
import Tuple from "../tuple.ts";
import Intersections from "../intersections.ts";

abstract class Shape {
    transform: Matrix = Matrix.Identity();
    material: Material = material();

    setTransform(t: Matrix) {
        this.transform = t;
    }

    intersect(ray: Ray): Intersections {
        const localRay = ray.transform(this.transform.inverse());
        return this.localIntersect(localRay);
    }

    abstract localIntersect(localRay: Ray): Intersections;

    normalAt(point: Tuple): Tuple {
        const localPoint = this.transform.inverse().multiplyTuple(point);
        const localNormal = this.localNormalAt(localPoint);
        const worldNormal = this.transform.inverse().transpose().multiplyTuple(localNormal);
        worldNormal.w = 0;

        return worldNormal.normalize();
    }

    abstract localNormalAt(localPoint: Tuple): Tuple;
}

export default Shape;