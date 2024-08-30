import Shape from "./shape.ts";
import Ray from "../ray.ts";
import Intersections, {emptyIntersections} from "../intersections.ts";
import Tuple from "../tuple.ts";

export default class Group extends Shape implements Iterable<Shape> {

    private readonly _items: Shape[];

    constructor(...items: Shape[]) {
        super();
        this._items = items;
    }

    protected localIntersect(localRay: Ray): Intersections {
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

    protected localNormalAt(localPoint: Tuple): Tuple {
        throw new Error(`localNormalAt is not implemented for group. Tried calling with ${localPoint}`);
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
    }

    push(item: Shape): void {
        item.parent = this;
        this._items.push(item);
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
}


export const makeGroup = (...items: Shape[]) => {
    return new Group(...items);
};

