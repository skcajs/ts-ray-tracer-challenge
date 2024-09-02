import {expect, test} from "vitest";
import {makePoint, makeVector} from "../tuple.ts";
import {makeSmoothTriangle} from "../shapes/smoothTriangle.ts";
import {compareTuples} from "./helpers.ts";
import {makeRay} from "../ray.ts";
import {makeIntersection} from "../intersection.ts";
import {makeIntersections} from "../intersections.ts";

test("Constructing a smooth triangle", () => {
    const p1 = makePoint(0, 1, 0);
    const p2 = makePoint(-1, 0, 0);
    const p3 = makePoint(1, 0, 0);
    const tri = makeSmoothTriangle(p1, p2, p3, p1, p2, p3);

    compareTuples(tri.p1, p1);
    compareTuples(tri.p2, p2);
    compareTuples(tri.p3, p3);
    compareTuples(tri.n1, p1);
    compareTuples(tri.n2, p2);
    compareTuples(tri.n3, p3);
});

test("An intersection with a smooth triangle stores u and v", () => {
    const p1 = makePoint(0, 1, 0);
    const p2 = makePoint(-1, 0, 0);
    const p3 = makePoint(1, 0, 0);
    const tri = makeSmoothTriangle(p1, p2, p3, p1, p2, p3);

    const r = makeRay(makePoint(-0.2, 0.3, -2), makeVector(0, 0, 1));
    const xs = tri.intersect(r);
    expect(xs[0].u).toBeCloseTo(0.45);
    expect(xs[0].v).toBeCloseTo(0.25);
});

test("A smooth triangle uses u and v to interpolate the normal", () => {
    const p1 = makePoint(0, 1, 0);
    const p2 = makePoint(-1, 0, 0);
    const p3 = makePoint(1, 0, 0);
    const tri = makeSmoothTriangle(p1, p2, p3, p1, p2, p3);

    const i = makeIntersection(1, tri, 0.45, 0.25);
    const n = tri.normalAt(makePoint(0, 0, 0), i);
    compareTuples(n, makeVector(-0.5547, 0.83205, 0));
});

test("Preparing the normal on a smooth triangle", () => {
    const p1 = makePoint(0, 1, 0);
    const p2 = makePoint(-1, 0, 0);
    const p3 = makePoint(1, 0, 0);
    const tri = makeSmoothTriangle(p1, p2, p3, p1, p2, p3);

    const i = makeIntersection(1, tri, 0.45, 0.25);
    const r = makeRay(makePoint(-0.2, 0.3, -2), makeVector(0, 0, 1));
    const xs = makeIntersections(i);
    const comps = i.prepareComputations(r, xs);
    compareTuples(comps.normalV, makeVector(-0.5547, 0.83205, 0));
});