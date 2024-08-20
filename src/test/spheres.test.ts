import {expect, test} from 'vitest'
import Ray from "../ray.ts";
import {makePoint, makeVector} from "../tuple.ts";
import Sphere from "../shapes/sphere.ts";
import Matrix from "../matrix.ts";
import {rotation, scaling, translation} from "../transformations.ts";
import {material} from "../material.ts";
import {compareTuples} from "./helpers.ts";

test('A ray intersects a sphere at two points', () => {
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(4.0);
    expect(xs[1].t).toBe(6.0);
});

test('A ray misses a sphere', () => {
    const r = new Ray(makePoint(0, 2, -5), makeVector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    console.log(xs);
    expect(xs.length).toBe(0);
});

test('A ray originates inside a sphere', () => {
    const r = new Ray(makePoint(0, 0, 0), makeVector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(-1.0);
    expect(xs[1].t).toBe(1.0);
});

test('A sphere is behind a ray', () => {
    const r = new Ray(makePoint(0, 0, 5), makeVector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(-6.0);
    expect(xs[1].t).toBe(-4.0);
});

test('Intersect set the object on the intersection', () => {
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
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
    const t = translation(2, 3, 4);
    s.setTransform(t);
    expect(s.transform).toEqual(t);
});

test('Intersecting a scaled sphere with a ray', () => {
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = new Sphere();
    s.setTransform(scaling(2, 2, 2));
    const xs = s.intersect(r);

    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(3);
    expect(xs[1].t).toBe(7);
});

test('Intersecting a translated sphere with a ray', () => {
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = new Sphere();
    s.setTransform(translation(5, 0, 0));
    const xs = s.intersect(r);

    expect(xs.length).toBe(0);
});

test('The normal on a sphere at a point on the x axis', () => {
    const s = new Sphere();
    const n = s.normalAt(makePoint(1, 0, 0));
    expect(n).toEqual(makeVector(1, 0, 0));
});

test('The normal on a sphere at a point on the y axis', () => {
    const s = new Sphere();
    const n = s.normalAt(makePoint(0, 1, 0));
    expect(n).toEqual(makeVector(0, 1, 0));
});

test('The normal on a sphere at a point on the \ axis', () => {
    const s = new Sphere();
    const n = s.normalAt(makePoint(0, 0, 1));
    expect(n).toEqual(makeVector(0, 0, 1));
});

test('The normal on a sphere at a non-axial point', () => {
    const s = new Sphere();
    const root = Math.sqrt(3) / 3
    const n = s.normalAt(makePoint(root, root, root));
    expect(n).toEqual(makeVector(root, root, root));
});

test('The normal is a normalized vector', () => {
    const s = new Sphere();
    const root = Math.sqrt(3) / 3
    const n = s.normalAt(makePoint(root, root, root));
    expect(n).toEqual(n.normalize());
});

test('Computing the normal on a translated sphere', () => {
    const s = new Sphere();
    s.setTransform(translation(0, 1, 0));
    const n = s.normalAt(makePoint(0, 1.70711, -0.70711));
    compareTuples(n, makeVector(0, 0.70711, -0.70711));
});

test('Computing the normal on a transformed sphere', () => {
    const s = new Sphere();
    const m = scaling(1, 0.5, 1).multiply(rotation(2, Math.PI / 5));
    s.setTransform(m);
    const n = s.normalAt(makePoint(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
    compareTuples(n, makeVector(0, 0.97014, -0.24254));
});

test('A sphere has a default material', () => {
    const s = new Sphere();
    expect(s.material).toEqual(material());
})

test('A sphere may be assigned a new material', () => {
    const s = new Sphere();
    const m = material();
    m.ambient = 1;
    s.material = m;
    expect(s.material).toEqual(m);
})