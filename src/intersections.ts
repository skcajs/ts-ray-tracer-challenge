import Intersection from "./intersection.ts";

export default class Intersections extends Array<Intersection> {
    constructor(...its: Intersection[]) {
        super(...its);
    }

    hit(): Intersection | null {
        return this.reduce<Intersection | null>((closest, intersection) => {
            if (intersection.t > 0 && (closest === null || intersection.t < closest.t)) {
                return intersection;
            }
            return closest;
        }, null);
    }
}

export const makeIntersections = (...its: Intersection[]) => {
    return new Intersections(...its);
};

export const emptyIntersections = () => {
    return new Intersections();
};