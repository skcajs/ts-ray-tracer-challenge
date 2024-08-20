import {expect, test} from "vitest";
import {makePoint, makeVector} from "../tuple.ts";
import {compareTuples} from "./helpers.ts";
import {makePlane} from "../shapes/plane.ts";
import {rotation} from "../transformations.ts";
import {makeRay} from "../ray.ts";

test("The normal of a plane is constant everywhere", () => {
    const p = makePlane();
    const n1 = p.normalAt(makePoint(0, 0, 0));
    const n2 = p.normalAt(makePoint(10, 0, -10));
    const n3 = p.normalAt(makePoint(-5, 0, 150));

    compareTuples(n1, makeVector(0, 1, 0));
    compareTuples(n2, makeVector(0, 1, 0));
    compareTuples(n3, makeVector(0, 1, 0));
});

test("The normal of a vertical plane is constant everywhere", () => {
    const p = makePlane();
    p.transform = rotation(0, Math.PI / 2);
    const n1 = p.normalAt(makePoint(0, 0, 0));
    const n2 = p.normalAt(makePoint(10, 0, -10));
    const n3 = p.normalAt(makePoint(-5, 0, 150));

    compareTuples(n1, makeVector(0, 0, 1));
    compareTuples(n2, makeVector(0, 0, 1));
    compareTuples(n3, makeVector(0, 0, 1));
});

test("Intersect with a ray parallel to the plane", () => {
    const p = makePlane();
    const r = makeRay(makePoint(0, 10, 0), makeVector(0, 0, 1));
    const xs = p.intersect(r);
    expect(xs.length).toBe(0);
});

test("Intersect with a coplanar ray", () => {
    const p = makePlane();
    const r = makeRay(makePoint(0, 10, 0), makeVector(0, 0, 1));
    const xs = p.intersect(r);
    expect(xs.length).toBe(0);
});

test("A ray intersecting a plane from above", () => {
    const p = makePlane();
    const r = makeRay(makePoint(0, 1, 0), makeVector(0, -1, 0));
    const xs = p.intersect(r);
    expect(xs.length).toBe(1);
    expect(xs[0].t).toBe(1);
    expect(xs[0].object).toEqual(p);
});

test("A ray intersecting a plane from below", () => {
    const p = makePlane();
    const r = makeRay(makePoint(0, -1, 0), makeVector(0, 1, 0));
    const xs = p.intersect(r);
    expect(xs.length).toBe(1);
    expect(xs[0].t).toBe(1);
    expect(xs[0].object).toEqual(p);
});