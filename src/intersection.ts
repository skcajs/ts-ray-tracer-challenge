import Ray from "./ray.ts";
import Tuple from "./tuple.ts";
import Shape from "./shapes/shape.ts";
import Intersections from "./intersections.ts";

export type Computations = {
    t: number;
    object: Shape;
    point: Tuple;
    eyeV: Tuple;
    normalV: Tuple;
    reflectV: Tuple;
    inside: boolean;
    overPoint: Tuple;
    underPoint: Tuple;
    n1: number;
    n2: number;
    schlick: number;
}

export default class Intersection {

    constructor(public t: number, public object: Shape, public u: number | undefined = undefined, public v: number | undefined = undefined) {
    }

    prepareComputations(r: Ray, xs?: Intersections): Computations {
        let containers: Shape[] = [];
        let n1: number = 1.0;
        let n2: number = 1.0;

        if (xs) {
            for (let i = 0; i < xs?.length; ++i) {
                if (xs[i] == this) {
                    if (containers.length > 0) {
                        n1 = containers[containers.length - 1].material.refractiveIndex;
                    }
                }
                if (containers.includes(xs[i].object)) {
                    containers = containers.filter(o => o != xs[i].object);
                } else {
                    containers.push(xs[i].object);
                }
                if (xs[i] == this) {
                    if (containers.length > 0) {
                        n2 = containers[containers.length - 1].material.refractiveIndex;
                    }
                    break;
                }
            }
        }

        let normalV = this.object.normalAt(r.position(this.t), this);
        let eyeV = r.direction.multiply(-1);
        let inside = false;
        if (normalV.dot(eyeV) < 0) {
            inside = true;
            normalV = normalV.multiply(-1);
        }

        return {
            t: this.t,
            object: this.object,
            point: r.position(this.t),
            eyeV: eyeV,
            normalV: normalV,
            reflectV: r.direction.reflect(normalV),
            inside: inside,
            overPoint: r.position(this.t).add(normalV.multiply(1e-5)),
            underPoint: r.position(this.t).subtract(normalV.multiply(1e-5)),
            n1: n1,
            n2: n2,
            schlick: (() => {
                let cos = eyeV.dot(normalV);
                if (n1 > n2) {
                    const sin2t = (n1 / n2) ** 2 * (1.0 - cos ** 2);
                    if (sin2t > 1.0) {
                        return 1.0;
                    }
                    cos = Math.sqrt(1.0 - sin2t);
                }
                const r0 = ((n1 - n2) / (n1 + n2)) ** 2;
                return r0 + (1 - r0) * (1 - cos) ** 5;
            })()
        };
    }
}

export const makeIntersection = (t: number, shape: Shape, u: number | undefined = undefined, v: number | undefined = undefined) => {
    return new Intersection(t, shape, u, v);
};

