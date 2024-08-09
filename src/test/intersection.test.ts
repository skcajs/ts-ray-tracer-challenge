import { expect, test } from 'vitest'
import Sphere from "../sphere.ts";
import Intersection from "../intersection.ts";
import Intersections from "../intersections.ts";

test('', () => {
    expect(true)
});

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