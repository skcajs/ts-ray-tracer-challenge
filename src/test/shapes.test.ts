// noinspection DuplicatedCode

import {expect, test} from "vitest";
import {compareMatrices, compareTuples} from "./helpers.ts";
import {identity} from "../matrix.ts";
import {rotation, scaling, translation} from "../transformations.ts";
import {material} from "../material.ts";
import {makeRay} from "../ray.ts";
import {makePoint, makeVector} from "../tuple.ts";
import {makeTestShape} from "../shapes/testShape.ts";
import {makeGroup} from "../shapes/group.ts";
import {makeSphere} from "../shapes/sphere.ts";

test("The default transformation", () => {
    const s = makeTestShape();
    compareMatrices(s.transform, identity());
});

test("Assigning a transformation", () => {
    const s = makeTestShape();
    s.setTransform(translation(2, 3, 4));
    compareMatrices(s.transform, translation(2, 3, 4));
});

test("The default material", () => {
    const s = makeTestShape();
    const m = s.material;
    expect(m).toEqual(material());
});

test("Assigning a material", () => {
    const s = makeTestShape();
    const m = s.material;
    m.ambient = 1;
    s.material = m;
    expect(s.material).toEqual(m);
});

test("Intersecting a scaled shape with a ray", () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = makeTestShape();
    s.setTransform(scaling(2, 2, 2));
    s.intersect(r);
    expect(s.savedRay?.origin).toEqual(makePoint(0, 0, -2.5));
    expect(s.savedRay?.direction).toEqual(makeVector(0, 0, 0.5));
});

test("Intersecting a translated shape with a ray", () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = makeTestShape();
    s.setTransform(translation(5, 0, 0));
    s.intersect(r);
    expect(s.savedRay?.origin).toEqual(makePoint(-5, 0, -5));
    expect(s.savedRay?.direction).toEqual(makeVector(0, 0, 1));
});

test("Computing the normal on a translated shape", () => {
    const s = makeTestShape();
    s.setTransform(translation(0, 1, 0));
    const n = s.normalAt(makePoint(0, 1.70711, -0.70711));
    compareTuples(n, makeVector(0, 0.70711, -0.70711));
});

test("Computing the normal on a transformed shape", () => {
    const s = makeTestShape();
    const m = scaling(1, 0.5, 1).multiply(rotation(2, Math.PI / 5));
    s.setTransform(m);
    const n = s.normalAt(makePoint(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
    compareTuples(n, makeVector(0, 0.97014, -0.24254));
});

test("A shape has a parent attribute", () => {
    const s = makeTestShape();
    expect(s.parent).toBeUndefined();
});

test("Converting a point from world to object space", () => {
    const g1 = makeGroup();
    g1.setTransform(rotation(1, Math.PI / 2));
    const g2 = makeGroup();
    g2.setTransform(scaling(2, 2, 2));
    g1.push(g2);
    const s = makeSphere();
    s.setTransform(translation(5, 0, 0));
    g2.push(s);
    const p = s.worldToObject(makePoint(-2, 0, -10));
    compareTuples(p, makePoint(0, 0, -1));
});

test("Converting a point from object to world space", () => {
    const r3o3 = Math.sqrt(3) / 3;
    const g1 = makeGroup();
    g1.setTransform(rotation(1, Math.PI / 2));
    const g2 = makeGroup();
    g2.setTransform(scaling(1, 2, 3));
    g1.push(g2);
    const s = makeSphere();
    s.setTransform(translation(5, 0, 0));
    g2.push(s);
    const n = s.normalToWorld(makeVector(r3o3, r3o3, r3o3));
    compareTuples(n, makeVector(0.2857, 0.4286, -0.8571));
});

test("Finding the normal on a child object", () => {
    const g1 = makeGroup();
    g1.setTransform(rotation(1, Math.PI / 2));
    const g2 = makeGroup();
    g2.setTransform(scaling(1, 2, 3));
    g1.push(g2);
    const s = makeSphere();
    s.setTransform(translation(5, 0, 0));
    g2.push(s);
    const n = s.normalAt(makePoint(1.7321, 1.1547, -5.5774));
    compareTuples(n, makeVector(0.2857, 0.4286, -0.8571));
});
