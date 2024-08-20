import {expect, test} from 'vitest'
import {makeRay} from "../ray.ts";
import {makePoint, makeVector} from "../tuple.ts";
import {makeSphere} from "../shapes/sphere.ts";
import {scaling, translation} from "../transformations.ts";

test('A ray intersects a sphere at two points', () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = makeSphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(4.0);
    expect(xs[1].t).toBe(6.0);
});

test('A ray misses a sphere', () => {
    const r = makeRay(makePoint(0, 2, -5), makeVector(0, 0, 1));
    const s = makeSphere();
    const xs = s.intersect(r);
    console.log(xs);
    expect(xs.length).toBe(0);
});

test('A ray originates inside a sphere', () => {
    const r = makeRay(makePoint(0, 0, 0), makeVector(0, 0, 1));
    const s = makeSphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(-1.0);
    expect(xs[1].t).toBe(1.0);
});

test('A sphere is behind a ray', () => {
    const r = makeRay(makePoint(0, 0, 5), makeVector(0, 0, 1));
    const s = makeSphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(-6.0);
    expect(xs[1].t).toBe(-4.0);
});

test('Intersect set the object on the intersection', () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = makeSphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].object).toEqual(s);
    expect(xs[1].object).toEqual(s);
})

test('Intersecting a scaled sphere with a ray', () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = makeSphere();
    s.setTransform(scaling(2, 2, 2));
    const xs = s.intersect(r);

    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(3);
    expect(xs[1].t).toBe(7);
});

test('Intersecting a translated sphere with a ray', () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = makeSphere();
    s.setTransform(translation(5, 0, 0));
    const xs = s.intersect(r);

    expect(xs.length).toBe(0);
});

test('The normal on a sphere at a point on the x axis', () => {
    const s = makeSphere();
    const n = s.normalAt(makePoint(1, 0, 0));
    expect(n).toEqual(makeVector(1, 0, 0));
});

test('The normal on a sphere at a point on the y axis', () => {
    const s = makeSphere();
    const n = s.normalAt(makePoint(0, 1, 0));
    expect(n).toEqual(makeVector(0, 1, 0));
});

test('The normal on a sphere at a point on the \ axis', () => {
    const s = makeSphere();
    const n = s.normalAt(makePoint(0, 0, 1));
    expect(n).toEqual(makeVector(0, 0, 1));
});

test('The normal on a sphere at a non-axial point', () => {
    const s = makeSphere();
    const root = Math.sqrt(3) / 3
    const n = s.normalAt(makePoint(root, root, root));
    expect(n).toEqual(makeVector(root, root, root));
});

test('The normal is a normalized vector', () => {
    const s = makeSphere();
    const root = Math.sqrt(3) / 3
    const n = s.normalAt(makePoint(root, root, root));
    expect(n).toEqual(n.normalize());
});