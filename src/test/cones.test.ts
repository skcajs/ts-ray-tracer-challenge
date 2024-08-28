import {expect, test} from "vitest";
import {makeCone} from "../shapes/cone.ts";
import {makePoint, makeVector} from "../tuple.ts";
import {makeRay} from "../ray.ts";
import {compareTuples} from "./helpers.ts";

test("Intersecting a cone with a ray", () => {
    const ex = [
        {o: makePoint(0, 0, -5), d: makeVector(0, 0, 1), t0: 5, t1: 5},
        {o: makePoint(0, 0, -5), d: makeVector(1, 1, 1), t0: 8.66025, t1: 8.66025},
        {o: makePoint(1, 1, -5), d: makeVector(-0.5, -1, 1), t0: 4.55006, t1: 49.44994}
    ];
    const shape = makeCone();
    for (let i = 0; i < ex.length; ++i) {
        const r = makeRay(ex[i].o, ex[i].d.normalize());
        const xs = shape.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0].t).toBeCloseTo(ex[i].t0);
        expect(xs[1].t).toBeCloseTo(ex[i].t1);
    }
});

test("Intersecting a cone with a ray parallel to one of its halves", () => {
    const shape = makeCone();
    const direction = makeVector(0, 1, 1).normalize();
    const r = makeRay(makePoint(0, 0, -1), direction);
    const xs = shape.intersect(r);
    expect(xs.length).toBe(1);
    expect(xs[0].t).toBeCloseTo(0.35355);
});

test("Intersecting a cone's end caps", () => {
    const ex = [
        {o: makePoint(0, 0, -5), d: makeVector(0, 1, 0), c: 0},
        {o: makePoint(0, 0, -0.25), d: makeVector(0, 1, 1), c: 2},
        {o: makePoint(0, 0, -0.25), d: makeVector(0, 1, 0), c: 4}
    ];

    const shape = makeCone();
    shape.minimum = -0.5;
    shape.maximum = 0.5;
    shape.closed = true;

    for (let i = 0; i < ex.length; ++i) {
        const direction = ex[i].d.normalize();
        const r = makeRay(ex[i].o, direction);
        const xs = shape.intersect(r);
        expect(xs.length).toBe(ex[i].c);
    }
});

test("Computing the normal vector of a cone", () => {
    const ex = [
        {p: makePoint(0, 0, 0), n: makeVector(0, 0, 0)},
        {p: makePoint(1, 1, 1), n: makeVector(0.5, -0.7071, 0.5)}, //using non-local
        {p: makePoint(-1, -1, 0), n: makeVector(-0.7071, 0.7071, 0)} //using non-local
    ];

    const shape = makeCone();

    for (let i = 0; i < ex.length; ++i) {
        const n = shape.normalAt(ex[i].p);
        compareTuples(n, ex[i].n);
    }
});