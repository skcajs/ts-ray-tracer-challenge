// noinspection DuplicatedCode

import Shape from "./shape.ts";
import Ray from "../ray.ts";
import Intersections, {emptyIntersections} from "../intersections.ts";
import Tuple, {makePoint} from "../tuple.ts";
import {Bounds} from "../bounds.ts";

export default class Group extends Shape implements Iterable<Shape> {

    private readonly _items: Shape[];

    bounds: Bounds = {
        minimum: makePoint(Infinity, Infinity, Infinity),
        maximum: makePoint(-Infinity, -Infinity, -Infinity)
    };

    constructor(...items: Shape[]) {
        super();
        this._items = items;
        this.bounds = this.getBounds();
    }

    protected localIntersect(localRay: Ray): Intersections {
        if (!this.groupIntersect(localRay)) return emptyIntersections();

        if (this._items.length == 0) {
            return emptyIntersections();
        }
        const xs = emptyIntersections();
        this._items.forEach((item) => {
            xs.push(...item.intersect(localRay));
        });
        xs.sort((a, b) => a.t - b.t);
        return xs;
    }

    private groupIntersect(localRay: Ray) {
        const xBounds = this.checkAxis(this.bounds.minimum.x, this.bounds.maximum.x, localRay.origin.x, localRay.direction.x);
        const yBounds = this.checkAxis(this.bounds.minimum.y, this.bounds.maximum.y, localRay.origin.y, localRay.direction.y);
        const zBounds = this.checkAxis(this.bounds.minimum.z, this.bounds.maximum.z, localRay.origin.z, localRay.direction.z);

        const tMin = Math.max(xBounds[0], yBounds[0], zBounds[0]);
        const tMax = Math.min(xBounds[1], yBounds[1], zBounds[1]);

        return tMin <= tMax;

    }

    protected localNormalAt(localPoint: Tuple): Tuple {
        throw new Error(`localNormalAt is not implemented for group. Tried calling with ${localPoint}`);
    }

    private checkAxis(min: number, max: number, origin: number, direction: number): [number, number] {
        const tMinNumerator = (min - origin);
        const tMaxNumerator = max - origin;
        let tMin: number;
        let tMax: number;
        if (Math.abs(direction) >= Number.EPSILON) {
            tMin = tMinNumerator / direction;
            tMax = tMaxNumerator / direction;
        } else {
            tMin = tMinNumerator * Infinity;
            tMax = tMaxNumerator * Infinity;
        }

        if (tMin > tMax) return [tMax, tMin];

        return [tMin, tMax];
    }

    [Symbol.iterator](): Iterator<Shape> {
        return this._items.values();
    }

    get length(): number {
        return this._items.length;
    }

    get(index: number): Shape | undefined {
        return this._items[index];
    }

    set(index: number, value: Shape): void {
        this._items[index] = value;
        this.bounds = this.getBounds();
    }

    push(...items: Shape[]): void {
        for (let item of items) {
            item.parent = this;
        }
        this._items.push(...items);
        this.bounds = this.getBounds();
    }

    pop(): Shape | undefined {
        return this._items.pop();
    }

    shift(): Shape | undefined {
        return this._items.shift();
    }

    unshift(...items: Shape[]): number {
        return this._items.unshift(...items);
    }

    includes(item: Shape): boolean {
        return this._items.includes(item);
    }

    // Custom method for accessing items directly using indexing
    // This allows group[0] to access the first item
    [index: number]: Shape;

    getBounds(): Bounds {
        let minBounds: Tuple = makePoint(Infinity, Infinity, Infinity);
        let maxBounds: Tuple = makePoint(-Infinity, -Infinity, -Infinity);

        if (this._items) {
            this._items.forEach((item) => {
                const bounds = item.getBounds();
                const corners = [
                    makePoint(bounds.minimum.x, bounds.minimum.y, bounds.minimum.z),
                    makePoint(bounds.maximum.x, bounds.minimum.y, bounds.minimum.z),
                    makePoint(bounds.minimum.x, bounds.maximum.y, bounds.minimum.z),
                    makePoint(bounds.minimum.x, bounds.minimum.y, bounds.maximum.z),
                    makePoint(bounds.maximum.x, bounds.maximum.y, bounds.minimum.z),
                    makePoint(bounds.maximum.x, bounds.minimum.y, bounds.maximum.z),
                    makePoint(bounds.minimum.x, bounds.maximum.y, bounds.maximum.z),
                    makePoint(bounds.maximum.x, bounds.maximum.y, bounds.maximum.z)
                ];
                for (let corner of corners) {
                    const transformedCorner = item.transform.multiplyTuple(corner);
                    minBounds.x = Math.min(minBounds.x, transformedCorner.x);
                    minBounds.y = Math.min(minBounds.y, transformedCorner.y);
                    minBounds.z = Math.min(minBounds.z, transformedCorner.z);
                    maxBounds.x = Math.max(maxBounds.x, transformedCorner.x);
                    maxBounds.y = Math.max(maxBounds.y, transformedCorner.y);
                    maxBounds.z = Math.max(maxBounds.z, transformedCorner.z);
                }
            });
        }
        return {minimum: minBounds, maximum: maxBounds};
    }
}


export const makeGroup = (...items: Shape[]) => {
    return new Group(...items);
};

