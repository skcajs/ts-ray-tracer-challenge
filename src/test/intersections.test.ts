// noinspection DuplicatedCode

import {expect, test} from "vitest";
import Sphere, {glassSphere, makeSphere} from "../shapes/sphere.ts";
import Intersection, {makeIntersection} from "../intersection.ts";
import Intersections from "../intersections.ts";
import Ray, {makeRay} from "../ray.ts";
import {black, makeColor, makePoint, makeVector, red} from "../tuple.ts";
import {compareTuples} from "./helpers.ts";
import {makePlane} from "../shapes/plane.ts";
import {scaling, translation} from "../transformations.ts";
import {defaultWorld} from "../world.ts";
import {makeTestPattern} from "../patterns/testPattern.ts";

test("An intersection encapsulates t and object", () => {
    const s = new Sphere();
    const i = new Intersection(3.5, s);
    expect(i.t).toBe(3.5);
    expect(i.object).toEqual(s);
});

test("Aggregating intersections", () => {
    const s = new Sphere();
    const i1 = new Intersection(1, s);
    const i2 = new Intersection(2, s);
    const xs = new Intersections(i1, i2);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(1);
    expect(xs[1].t).toBe(2);
});

test("The hit, when all intersections have positive t", () => {
    const s = new Sphere();
    const i1 = new Intersection(1, s);
    const i2 = new Intersection(2, s);
    const xs = new Intersections(i2, i1);
    const i = xs.hit();
    expect(i).toEqual(i1);
});

test("The hit, when some intersections have negative t", () => {
    const s = new Sphere();
    const i1 = new Intersection(-1, s);
    const i2 = new Intersection(2, s);
    const xs = new Intersections(i2, i1);
    const i = xs.hit();
    expect(i).toEqual(i2);
});

test("The hit, when all intersections have negative t", () => {
    const s = new Sphere();
    const i1 = new Intersection(-2, s);
    const i2 = new Intersection(-1, s);
    const xs = new Intersections(i2, i1);
    const i = xs.hit();
    expect(i).toEqual(null);
});

test("The hit is always the lowest non-negative intersection", () => {
    const s = new Sphere();
    const i1 = new Intersection(5, s);
    const i2 = new Intersection(7, s);
    const i3 = new Intersection(-3, s);
    const i4 = new Intersection(2, s);
    const xs = new Intersections(i1, i2, i3, i4);
    const i = xs.hit();
    expect(i).toEqual(i4);
});

test("Precomputing the state of an intersection", () => {
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

test("The hit, when an intersection occurs on the outside", () => {
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const shape = new Sphere();
    const i = new Intersection(4, shape);
    const comps = i.prepareComputations(r);
    expect(comps.inside).toBeFalsy();
});

test("The hit, when an intersection occurs on the inside", () => {
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
    compareTuples(comps.reflectV, makeVector(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2));
});

test("Finding n1 and n2 at various intersections", () => {
    const a = glassSphere();
    a.transform = scaling(2, 2, 2);
    a.material.refractiveIndex = 1.5;

    const b = glassSphere();
    b.transform = translation(0, 0, -0.25);
    b.material.refractiveIndex = 2.0;

    const c = glassSphere();
    c.transform = translation(0, 0, 0.25);
    c.material.refractiveIndex = 2.5;

    const r = makeRay(makePoint(0, 0, -4), makeVector(0, 0, 1));
    const xs = new Intersections(
        makeIntersection(2, a),
        makeIntersection(2.75, b),
        makeIntersection(3.25, c),
        makeIntersection(4.75, b),
        makeIntersection(5.25, c),
        makeIntersection(6, a));

    const ris = [[1.0, 1.5], [1.5, 2.0], [2.0, 2.5], [2.5, 2.5], [2.5, 1.5], [1.5, 1.0]];

    for (let i = 0; i < 6; ++i) {
        const comps = xs[i].prepareComputations(r, xs);
        expect(comps.n1).toBe(ris[i][0]);
        expect(comps.n2).toBe(ris[i][1]);
    }
});

test("The under point is offset below the surface", () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const shape = glassSphere();
    shape.setTransform(translation(0, 0, 1));
    const i = makeIntersection(5, shape);
    const xs = new Intersections(i);
    const comps = i.prepareComputations(r, xs);
    expect(comps.underPoint.z).toBeLessThan(0.0001 / 2);
    expect(comps.point.z).toBeLessThan(comps.underPoint.z);
});

test("The refracted color with an opaque surface", () => {
    const w = defaultWorld();
    const shape = w.objects[0];
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const xs = new Intersections(makeIntersection(4, shape), makeIntersection(6, shape));
    const comps = xs[0].prepareComputations(r, xs);
    const c = w.refractedColor(comps, 5);
    compareTuples(c, black());
});

test("The refracted color at the maximum recursive depth", () => {
    const w = defaultWorld();
    const shape = w.objects[0];
    shape.material.transparency = 1.0;
    shape.material.refractiveIndex = 1.5;
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const xs = new Intersections(makeIntersection(4, shape), makeIntersection(6, shape));
    const comps = xs[0].prepareComputations(r, xs);
    const c = w.refractedColor(comps, 0);
    compareTuples(c, black());
});

test("The refracted color under total internal reflection", () => {
    const w = defaultWorld();
    const shape = w.objects[0];
    shape.material.transparency = 1.0;
    shape.material.refractiveIndex = 1.5;
    const r = makeRay(makePoint(0, 0, Math.sqrt(2) / 2), makeVector(0, 1, 0));
    const xs = new Intersections(makeIntersection(-Math.sqrt(2) / 2, shape), makeIntersection(Math.sqrt(2) / 2, shape));
    const comps = xs[1].prepareComputations(r, xs);
    const c = w.refractedColor(comps, 5);
    compareTuples(c, black());
});

test("The refracted color with a refracted ray", () => {
    const w = defaultWorld();
    const a = w.objects[0];
    a.material.ambient = 1.0;
    a.material.pattern = makeTestPattern();
    const b = w.objects[1];
    b.material.transparency = 1.0;
    b.material.refractiveIndex = 1.5;
    const r = makeRay(makePoint(0, 0, 0.1), makeVector(0, 1, 0));
    const xs = new Intersections(makeIntersection(-0.9899, a), makeIntersection(-0.4899, b), makeIntersection(0.4899, b), makeIntersection(0.9899, a));
    const comps = xs[2].prepareComputations(r, xs);
    const c = w.refractedColor(comps, 5);
    compareTuples(c, makeColor(0, 0.99888, 0.04725));
});

test("shadeHit() with a transparent material", () => {
    const w = defaultWorld();
    const floor = makePlane();
    floor.setTransform(translation(0, -1, 0));
    floor.material.transparency = 0.5;
    floor.material.refractiveIndex = 1.5;
    w.objects.push(floor);
    const ball = makeSphere();
    ball.material.color = red();
    ball.material.ambient = 0.5;
    ball.setTransform(translation(0, -3.5, -0.5));
    w.objects.push(ball);
    const r = makeRay(makePoint(0, 0, -3), makeVector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const xs = new Intersections(makeIntersection(Math.sqrt(2), floor));
    const comps = xs[0].prepareComputations(r, xs);
    const c = w.shadeHit(comps, 5);
    compareTuples(c, makeColor(0.93642, 0.68642, 0.68642));
});

test("The Schlick approximation under total internal reflection", () => {
    const shape = glassSphere();
    const r = makeRay(makePoint(0, 0, Math.sqrt(2) / 2), makeVector(0, 1, 0));
    const xs = new Intersections(makeIntersection(-Math.sqrt(2) / 2, shape), makeIntersection(Math.sqrt(2) / 2, shape));
    const comps = xs[1].prepareComputations(r, xs);
    const reflectance = comps.schlick;
    expect(reflectance).toBeCloseTo(1.0);
});

test("The Schlick approximation with a perpendicular viewing angle", () => {
    const shape = glassSphere();
    const r = makeRay(makePoint(0, 0, 0), makeVector(0, 1, 0));
    const xs = new Intersections(makeIntersection(-1, shape), makeIntersection(1, shape));
    const comps = xs[1].prepareComputations(r, xs);
    const reflectance = comps.schlick;
    expect(reflectance).toBeCloseTo(0.04);
});

test("The Schlick approximation with a small angle and n2 > n1", () => {
    const shape = glassSphere();
    const r = makeRay(makePoint(0, 0.99, -2), makeVector(0, 0, 1));
    const xs = new Intersections(makeIntersection(1.8589, shape));
    const comps = xs[0].prepareComputations(r, xs);
    const reflectance = comps.schlick;
    expect(reflectance).toBeCloseTo(0.48873);
});

test("shadeHit() with a reflective, transparent material", () => {
    const w = defaultWorld();
    const floor = makePlane();
    floor.setTransform(translation(0, -1, 0));
    floor.material.reflective = 0.5;
    floor.material.transparency = 0.5;
    floor.material.refractiveIndex = 1.5;
    w.objects.push(floor);
    const ball = makeSphere();
    ball.material.color = red();
    ball.material.ambient = 0.5;
    ball.setTransform(translation(0, -3.5, -0.5));
    w.objects.push(ball);
    const r = makeRay(makePoint(0, 0, -3), makeVector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
    const xs = new Intersections(makeIntersection(Math.sqrt(2), floor));
    const comps = xs[0].prepareComputations(r, xs);
    const c = w.shadeHit(comps, 5);
    compareTuples(c, makeColor(0.93391, 0.69643, 0.69643));
});