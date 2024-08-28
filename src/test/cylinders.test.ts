import {expect, test} from "vitest";
import {makePoint, makeVector} from "../tuple.ts";
import {makeRay} from "../ray.ts";
import {makeCylinder} from "../shapes/cylinder.ts";
import {compareTuples} from "./helpers.ts";

test("A ray misses a cylinder", () => {
    const ex = [
        {o: makePoint(1, 0, 0), d: makeVector(0, 1, 0)},
        {o: makePoint(0, 0, 0), d: makeVector(0, 1, 0)},
        {o: makePoint(0, 0, -5), d: makeVector(1, 1, 1)}
    ];
    const cyl = makeCylinder();
    for (let i = 0; i < ex.length; ++i) {
        const direction = ex[i].d.normalize();
        const r = makeRay(ex[i].o, direction);
        const xs = cyl.intersect(r);
        expect(xs.length).toBe(0);
    }
});

test("A ray strikes a cylinder", () => {
    const ex = [
        {o: makePoint(1, 0, -5), d: makeVector(0, 0, 1), t0: 5, t1: 5},
        {o: makePoint(0, 0, -5), d: makeVector(0, 0, 1), t0: 4, t1: 6},
        {o: makePoint(0.5, 0, -5), d: makeVector(0.1, 1, 1), t0: 6.80798, t1: 7.08872}
    ];
    const cyl = makeCylinder();
    for (let i = 0; i < ex.length; ++i) {
        const direction = ex[i].d.normalize();
        const r = makeRay(ex[i].o, direction);
        const xs = cyl.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0].t).toBeCloseTo(ex[i].t0);
        expect(xs[1].t).toBeCloseTo(ex[i].t1);
    }
});

test("Normal vector on a cylinder", () => {
    const ex = [
        {p: makePoint(1, 0, 0), n: makeVector(1, 0, 0)},
        {p: makePoint(0, 5, -1), n: makeVector(0, 0, -1)},
        {p: makePoint(0, -2, 1), n: makeVector(0, 0, 1)},
        {p: makePoint(-1, 1, 0), n: makeVector(-1, 0, 0)}
    ];
    const cyl = makeCylinder();
    for (let i = 0; i < ex.length; ++i) {
        const n = cyl.normalAt(ex[i].p);
        compareTuples(n, ex[i].n);
    }
});

test("The default minimum and maximum for a cylinder", () => {
    const cyl = makeCylinder();
    expect(cyl.minimum).toBe(-Infinity);
    expect(cyl.maximum).toBe(Infinity);
});

test("Intersecting a constrained cylinder", () => {
    const ex = [
        {p: makePoint(0, 1.5, 0), d: makeVector(0.1, 1, 0), c: 0},
        {p: makePoint(0, 3, -5), d: makeVector(0, 0, 1), c: 0},
        {p: makePoint(0, 0, -5), d: makeVector(0, 0, 1), c: 0},
        {p: makePoint(0, 2, -5), d: makeVector(0, 0, 1), c: 0},
        {p: makePoint(0, 1, -5), d: makeVector(0, 0, 1), c: 0},
        {p: makePoint(0, 1.5, -2), d: makeVector(0, 0, 1), c: 2}
    ];
    const cyl = makeCylinder();
    cyl.minimum = 1;
    cyl.maximum = 2;
    for (let i = 0; i < ex.length; ++i) {
        const direction = ex[i].d.normalize();
        const r = makeRay(ex[i].p, direction);
        const xs = cyl.intersect(r);
        expect(xs.length).toBe(ex[i].c);
    }
});

test("The default closed value for a cylinder", () => {
    const cyl = makeCylinder();
    expect(cyl.closed).toBeFalsy();
});

test("Intersecting the caps of a closed cylinder", () => {
    const ex = [
        {p: makePoint(0, 3, 0), d: makeVector(0, -1, 0), c: 2},
        {p: makePoint(0, 3, -2), d: makeVector(0, -1, 2), c: 2},
        {p: makePoint(0, 4, -2), d: makeVector(0, -1, 1), c: 2},
        {p: makePoint(0, 0, -2), d: makeVector(0, 1, 2), c: 2},
        {p: makePoint(0, -1, -2), d: makeVector(0, 1, 1), c: 2}
    ];
    const cyl = makeCylinder();
    cyl.minimum = 1;
    cyl.maximum = 2;
    cyl.closed = true;
    for (let i = 0; i < ex.length; ++i) {
        const direction = ex[i].d.normalize();
        const r = makeRay(ex[i].p, direction);
        const xs = cyl.intersect(r);
        expect(xs.length).toBe(ex[i].c);
    }
});

test("The normal vector on a cylinder's end caps", () => {
    const ex = [
        {p: makePoint(0, 1, 0), n: makeVector(0, -1, 0)},
        {p: makePoint(0.5, 1, 0), n: makeVector(0, -1, 0)},
        {p: makePoint(0, 1, 0.5), n: makeVector(0, -1, 0)},
        {p: makePoint(0, 2, 0), n: makeVector(0, 1, 0)},
        {p: makePoint(0.5, 2, 0), n: makeVector(0, 1, 0)},
        {p: makePoint(0, 2, 0.5), n: makeVector(0, 1, 0)}
    ];
    const cyl = makeCylinder();
    cyl.minimum = 1;
    cyl.maximum = 2;
    cyl.closed = true;
    for (let i = 0; i < ex.length; ++i) {
        const n = cyl.normalAt(ex[i].p);
        compareTuples(n, ex[i].n);
    }
});