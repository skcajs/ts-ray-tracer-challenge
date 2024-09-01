import {expect, test} from "vitest";
import {makePoint, makeVector} from "../tuple.ts";
import {makeTriangle} from "../shapes/triangle.ts";
import {compareTuples} from "./helpers.ts";
import {makeRay} from "../ray.ts";

test("Constructing a triangle", () => {
    const p1 = makePoint(0, 1, 0);
    const p2 = makePoint(-1, 0, 0);
    const p3 = makePoint(1, 0, 0);
    const t = makeTriangle(p1, p2, p3);
    compareTuples(t.p1, p1);
    compareTuples(t.p2, p2);
    compareTuples(t.p3, p3);
    compareTuples(t.e1, makeVector(-1, -1, 0));
    compareTuples(t.e2, makeVector(1, -1, 0));
    compareTuples(t.normal, makeVector(0, 0, -1));
});

test("Finding the normal on a triangle", () => {
    const t = makeTriangle(makePoint(0, 1, 0), makePoint(-1, 0, 0), makePoint(1, 0, 0));
    const n1 = t.normalAt(makePoint(0, 0.5, 0));
    const n2 = t.normalAt(makePoint(-0.5, 0.75, 0));
    const n3 = t.normalAt(makePoint(0.5, 0.25, 0));
    compareTuples(n1, t.normal);
    compareTuples(n2, t.normal);
    compareTuples(n3, t.normal);
});

test("Intersecting a ray parallel to the triangle", () => {
    const t = makeTriangle(makePoint(0, 1, 0), makePoint(-1, 0, 0), makePoint(1, 0, 0));
    const r = makeRay(makePoint(0, -1, -2), makeVector(0, 1, 0));
    const xs = t.intersect(r);
    expect(xs.length).toBe(0);
});

test("A ray misses the p1-p3 edge", () => {
    const t = makeTriangle(makePoint(0, 1, 0), makePoint(-1, 0, 0), makePoint(1, 0, 0));
    const r = makeRay(makePoint(1, 1, -2), makeVector(0, 0, 1));
    const xs = t.intersect(r);
    expect(xs.length).toBe(0);
});

test("A ray misses the p1-p2 edge", () => {
    const t = makeTriangle(makePoint(0, 1, 0), makePoint(-1, 0, 0), makePoint(1, 0, 0));
    const r = makeRay(makePoint(-1, 1, -2), makeVector(0, 0, 1));
    const xs = t.intersect(r);
    expect(xs.length).toBe(0);
});

test("A ray misses the p2-p3 edge", () => {
    const t = makeTriangle(makePoint(0, 1, 0), makePoint(-1, 0, 0), makePoint(1, 0, 0));
    const r = makeRay(makePoint(0, -1, -2), makeVector(0, 0, 1));
    const xs = t.intersect(r);
    expect(xs.length).toBe(0);
});

test("A ray strikes a triangle", () => {
    const t = makeTriangle(makePoint(0, 1, 0), makePoint(-1, 0, 0), makePoint(1, 0, 0));
    const r = makeRay(makePoint(0, 0.5, -2), makeVector(0, 0, 1));
    const xs = t.intersect(r);
    expect(xs.length).toBe(1);
    expect(xs[0].t).toBe(2);
});