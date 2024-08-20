import Matrix from "../matrix.ts";
import Material, {material} from "../material.ts";
import Ray from "../ray.ts";
import Tuple, {makeVector} from "../tuple.ts";
import Intersections from "../intersections.ts";

abstract class Shape {
    transform: Matrix = Matrix.Identity();
    material: Material = material();

    setTransform(t: Matrix) {
        this.transform = t;
    }

    intersect(ray: Ray): Intersections {
        return this.localIntersect(ray.transform(this.transform.inverse()));
    }

    normalAt(point: Tuple): Tuple {
        const localNormal = this.localNormalAt(this.transform.inverse().multiplyTuple(point));
        const worldNormal = this.transform.inverse().transpose().multiplyTuple(localNormal);
        return makeVector(worldNormal.x, worldNormal.y, worldNormal.z).normalize();
    }

    protected abstract localIntersect(localRay: Ray): Intersections;

    protected abstract localNormalAt(localPoint: Tuple): Tuple;
}

export default Shape;