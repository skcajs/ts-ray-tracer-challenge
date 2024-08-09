import { expect, test } from 'vitest'
import Ray from "../ray.ts";
import {makePoint, makeVector} from "../tuple.ts";
import Sphere from "../sphere.ts";
import Matrix from "../matrix.ts";
import {scaling, translation} from "../transformations.ts";

test('A ray intersects a sphere at two points', () => {
    const r = new Ray(makePoint(0,0,-5), makeVector(0,0,1));
    const s = new Sphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(4.0);
    expect(xs[1].t).toBe(6.0);
});

test('A ray misses a sphere', () => {
    const r = new Ray(makePoint(0,2,-5), makeVector(0,0,1));
    const s = new Sphere();
    const xs = s.intersect(r);
    console.log(xs);
    expect(xs.length).toBe(0);
});

test('A ray originates inside a sphere', () => {
    const r = new Ray(makePoint(0,0,0), makeVector(0,0,1));
    const s = new Sphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(-1.0);
    expect(xs[1].t).toBe(1.0);
});

test('A sphere is behind a ray', () => {
    const r = new Ray(makePoint(0,0,5), makeVector(0,0,1));
    const s = new Sphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(-6.0);
    expect(xs[1].t).toBe(-4.0);
});

test('Intersect set the object on the intersection', () => {
    const r = new Ray(makePoint(0,0,-5), makeVector(0,0,1));
    const s = new Sphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].object).toEqual(s);
    expect(xs[1].object).toEqual(s);
})

test('A spheres default transformation is the identity matrix', () => {
    const s = new Sphere();
    expect(s.transform).toEqual(Matrix.Identity());
});

test('Changing a spheres transformation', () => {
    const s = new Sphere();
    const t = translation(2,3,4);
    s.setTransform(t);
    expect(s.transform).toEqual(t);
});

test('Intersecting a scaled sphere with a ray', () => {
    const r = new Ray(makePoint(0,0,-5), makeVector(0,0,1));
    const s = new Sphere();
    s.setTransform(scaling(2,2,2));
    const xs = s.intersect(r);

    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(3);
    expect(xs[1].t).toBe(7);
});

test('Intersecting a translated sphere with a ray', () => {
    const r = new Ray(makePoint(0,0,-5), makeVector(0,0,1));
    const s = new Sphere();
    s.setTransform(translation(5,0,0));
    const xs = s.intersect(r);

    expect(xs.length).toBe(0);
});