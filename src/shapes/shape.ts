import Matrix, {identity} from "../matrix.ts";
import Material, {material} from "../material.ts";
import Ray from "../ray.ts";
import Tuple from "../tuple.ts";
import Intersections from "../intersections.ts";
import {Bounds} from "../bounds.ts";
import Intersection from "../intersection.ts";

abstract class Shape {
    transform: Matrix = identity();
    material: Material = material();
    parent?: Shape;

    setTransform(t: Matrix) {
        this.transform = t;
    }

    intersect(ray: Ray): Intersections {
        return this.localIntersect(ray.transform(this.transform.inverse()));
    }

    normalAt(point: Tuple, i?: Intersection): Tuple {
        return this.normalToWorld(this.localNormalAt(this.worldToObject(point), i));
    }

    worldToObject(point: Tuple) {
        if (this.parent) {
            point = this.parent.worldToObject(point);
        }
        return this.transform.inverse().multiplyTuple(point);
    }

    normalToWorld(normal: Tuple) {
        normal = this.transform.inverse().transpose().multiplyTuple(normal);
        normal.w = 0;
        normal = normal.normalize();

        if (this.parent) {
            normal = this.parent.normalToWorld(normal);
        }

        return normal;
    }

    abstract getBounds(): Bounds;

    protected abstract localIntersect(localRay: Ray): Intersections;

    protected abstract localNormalAt(localPoint: Tuple, i?: Intersection): Tuple;
}

export default Shape;