import Sphere from "./sphere.ts";
import Ray from "./ray.ts";
import Tuple from "./tuple.ts";

export type Computations = {
    t: number;
    object: Sphere;
    point: Tuple;
    eyeV: Tuple;
    normalV: Tuple;
    inside: boolean;
    overPoint: Tuple;
}

export default class Intersection {
    constructor(public t: number, public object: Sphere) {
    }

    prepareComputations(r: Ray): Computations {
        let normalV = this.object.normalAt(r.position(this.t));
        let eyeV = r.direction.multiply(-1);
        let inside = false;
        if (normalV.dot(eyeV) < 0) {
            inside = true;
            normalV = normalV.multiply(-1);
        }

        let overPoint = r.position(this.t).add(normalV.multiply(1e-5));

        return {
            t: this.t,
            object: this.object,
            point: r.position(this.t),
            eyeV: eyeV,
            normalV: normalV,
            inside: inside,
            overPoint: overPoint,
        }
    }
}