import {expect, test} from 'vitest'
import Sphere from "../shapes/sphere.ts";
import Intersection, {makeIntersection} from "../intersection.ts";
import Intersections from "../intersections.ts";
import Ray, {makeRay} from "../ray.ts";
import {makePoint, makeVector} from "../tuple.ts";
import {compareTuples} from "./helpers.ts";
import {makePlane} from "../shapes/plane.ts";

test('An intersection encapsulates t and object', () => {
    const s = new Sphere();
    const i = new Intersection(3.5, s);
    expect(i.t).toBe(3.5);
    expect(i.object).toEqual(s);
});

test('Aggregating intersections', () => {
    const s = new Sphere();
    const i1 = new Intersection(1, s);
    const i2 = new Intersection(2, s);
    const xs = new Intersections(i1, i2);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(1);
    expect(xs[1].t).toBe(2);
});

test('The hit, when all intersections have positive t', () => {
    const s = new Sphere();
    const i1 = new Intersection(1, s);
    const i2 = new Intersection(2, s);
    const xs = new Intersections(i2, i1);
    const i = xs.hit();
    expect(i).toEqual(i1);
});

test('The hit, when some intersections have negative t', () => {
    const s = new Sphere();
    const i1 = new Intersection(-1, s);
    const i2 = new Intersection(2, s);
    const xs = new Intersections(i2, i1);
    const i = xs.hit();
    expect(i).toEqual(i2);
});

test('The hit, when all intersections have negative t', () => {
    const s = new Sphere();
    const i1 = new Intersection(-2, s);
    const i2 = new Intersection(-1, s);
    const xs = new Intersections(i2, i1);
    const i = xs.hit();
    expect(i).toEqual(null);
});

test('The hit is always the lowest non-negative intersection', () => {
    const s = new Sphere();
    const i1 = new Intersection(5, s);
    const i2 = new Intersection(7, s);
    const i3 = new Intersection(-3, s);
    const i4 = new Intersection(2, s);
    const xs = new Intersections(i1, i2, i3, i4);
    const i = xs.hit();
    expect(i).toEqual(i4);
});

test('Precomputing the state of an intersection', () => {
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const shape = new Sphere();
    const i = new Intersection(4, shape);
    const comps = i.prepareComputations(r);
    expect(comps.t).toEqual(i.t);
    expect(comps.object).toEqual(i.object);
    compareTuples(comps.point, makePoint(0, 0, -1));
    compareTuples(comps.eyeV, makeVector(0, 0, -1));
    compareTuples(comps.normalV, makeVector(0, 0, -1));
});

test('The hit, when an intersection occurs on the outside', () => {
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const shape = new Sphere();
    const i = new Intersection(4, shape);
    const comps = i.prepareComputations(r);
    expect(comps.inside).toBeFalsy();
});

test('The hit, when an intersection occurs on the inside', () => {
    const r = new Ray(makePoint(0, 0, 0), makeVector(0, 0, 1));
    const shape = new Sphere();
    const i = new Intersection(1, shape);
    const comps = i.prepareComputations(r);
    compareTuples(comps.point, makePoint(0, 0, 1));
    compareTuples(comps.eyeV, makeVector(0, 0, -1));
    expect(comps.inside).toBeTruthy();
    compareTuples(comps.normalV, makeVector(0, 0, -1));
});

test("Precomputing the reflection vector", () => {
    const shape = makePlane();
    const r = makeRay(makePoint(0, 0, -1), makeVector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const i = makeIntersection(Math.sqrt(2), shape);
    const comps = i.prepareComputations(r);
    compareTuples(comps.reflectV, makeVector(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2))
});