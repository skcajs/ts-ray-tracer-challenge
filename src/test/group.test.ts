import {expect, test} from "vitest";
import {makeGroup} from "../shapes/group.ts";
import {compareMatrices} from "./helpers.ts";
import {identity} from "../matrix.ts";
import {makeTestShape} from "../shapes/testShape.ts";
import {makeRay} from "../ray.ts";
import {makePoint, makeVector} from "../tuple.ts";
import {makeSphere} from "../shapes/sphere.ts";
import {scaling, translation} from "../transformations.ts";

test("Creating a new group", () => {
    const g = makeGroup();
    compareMatrices(g.transform, identity());
    expect(g.length).toBe(0);
});

test("Adding a child to a group", () => {
    const g = makeGroup();
    const s = makeTestShape();
    g.push(s);
    expect(g.length).toBe(1);
    expect(g.includes(s)).toBeTruthy();
    expect(s.parent).toEqual(g);
});

test("Intersecting a ray with an empty group", () => {
    const g = makeGroup();
    const r = makeRay(makePoint(0, 0, 0), makeVector(0, 0, 1));
    const xs = g.intersect(r);
    expect(xs.length).toBe(0);
});

test("Intersecting a ray with a nonempty group", () => {
    const g = makeGroup();
    const s1 = makeSphere();
    const s2 = makeSphere();
    s2.setTransform(translation(0, 0, -3));
    const s3 = makeSphere();
    s3.setTransform(translation(5, 0, 0));
    g.push(s1);
    g.push(s2);
    g.push(s3);
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const xs = g.intersect(r);
    expect(xs.length).toBe(4);
    expect(xs[0].object).toEqual(s2);
    expect(xs[1].object).toEqual(s2);
    expect(xs[2].object).toEqual(s1);
    expect(xs[3].object).toEqual(s1);
});

test("Intersecting a transformed group", () => {
    const g = makeGroup();
    g.setTransform(scaling(2, 2, 2));
    const s = makeSphere();
    s.setTransform(translation(5, 0, 0));
    g.push(s);
    const r = makeRay(makePoint(10, 0, -10), makeVector(0, 0, 1));
    const xs = g.intersect(r);
    expect(xs.length).toBe(2);
});