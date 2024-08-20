import {expect, test} from "vitest";
import {defaultWorld, emptyWorld} from "../world.ts";
import {pointLight} from "../light.ts";
import {makeColor, makePoint, makeVector} from "../tuple.ts";
import Sphere from "../shapes/sphere.ts";
import {scaling, translation} from "../transformations.ts";
import Ray from "../ray.ts";
import Intersection from "../intersection.ts";
import {compareTuples} from "./helpers.ts";

test('Creating a world', () => {
    const w = emptyWorld();
    expect(w.objects.length).toBe(0);
    expect(w.light).toEqual(pointLight(makePoint(0, 0, 0), makeColor(1, 1, 1)));
});

test('The default world', () => {
    const l = pointLight(makePoint(-10, 10, -10), makeColor(1, 1, 1));
    const s1 = new Sphere();
    const s2 = new Sphere();
    s1.material.color = makeColor(0.8, 1.0, 0.6);
    s1.material.diffuse = 0.7;
    s1.material.specular = 0.2;
    s2.transform = scaling(0.5, 0.5, 0.5);
    const w = defaultWorld();
    expect(w.objects[0]).toEqual(s1);
    expect(w.objects[1]).toEqual(s2);
    expect(w.light).toEqual(l);
});


test('Intersect a world with a ray', () => {
    const w = defaultWorld();
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const xs = w.intersect(r);
    expect(xs.length).toBe(4);
    expect(xs[0].t).toBe(4);
    expect(xs[1].t).toBe(4.5);
    expect(xs[2].t).toBe(5.5);
    expect(xs[3].t).toBe(6);
});

test('Shading an intersection', () => {
    const w = defaultWorld();
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const shape = w.objects[0];
    const i = new Intersection(4, shape);
    const comps = i.prepareComputations(r);
    const c = w.hitShade(comps);
    compareTuples(c, makeColor(0.38066, 0.47583, 0.2855));
});

test('Shading an intersection from the inside', () => {
    const w = defaultWorld();
    w.light = pointLight(makePoint(0, 0.25, 0), makeColor(1, 1, 1));
    const r = new Ray(makePoint(0, 0, 0), makeVector(0, 0, 1));
    const shape = w.objects[1];
    const i = new Intersection(0.5, shape);
    const comps = i.prepareComputations(r);
    const c = w.hitShade(comps);
    compareTuples(c, makeColor(0.90498, 0.90498, 0.90498));
});

test('The color when a ray misses', () => {
    const w = defaultWorld();
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 1, 0));
    const c = w.colorAt(r);
    compareTuples(c, makeColor(0, 0, 0));
});

test('The color when a ray hits', () => {
    const w = defaultWorld();
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const c = w.colorAt(r);
    compareTuples(c, makeColor(0.38066, 0.47583, 0.2855));
});

test('The color with an intersection behind the ray', () => {
    const w = defaultWorld();
    const outer = w.objects[0];
    outer.material.ambient = 1.0;
    const inner = w.objects[1];
    inner.material.ambient = 1.0;
    const r = new Ray(makePoint(0, 0, 0.75), makeVector(0, 0, -1));
    const c = w.colorAt(r);
    compareTuples(c, inner.material.color);
});

test('There is no shadow when nothing is collinear with the point and light', () => {
    const w = defaultWorld();
    const p = makePoint(0, 10, 0);
    expect(w.isShadowed(p)).toBeFalsy();
});

test('There is a shadow when an object is between the point and light', () => {
    const w = defaultWorld();
    const p = makePoint(10, -10, 10);
    expect(w.isShadowed(p)).toBeTruthy();
});

test('There is no shadow when an object is behind the light', () => {
    const w = defaultWorld();
    const p = makePoint(-20, 20, -20);
    expect(w.isShadowed(p)).toBeFalsy();
});

test('There is no shadow when an object is behind the point', () => {
    const w = defaultWorld();
    const p = makePoint(-2, 2, -2);
    expect(w.isShadowed(p)).toBeFalsy();
});

test('shadeHit() is given an intersection in shadow', () => {
    const w = emptyWorld();
    w.light = pointLight(makePoint(0, 0, -10), makeColor(1, 1, 1));
    const s1 = new Sphere();
    w.objects.push(s1);
    const s2 = new Sphere();
    s2.transform = translation(0, 0, 10);
    w.objects.push(s2);
    const r = new Ray(makePoint(0, 0, 5), makeVector(0, 0, 1));
    const i = new Intersection(4, s2);
    const comps = i.prepareComputations(r);
    const c = w.hitShade(comps);
    compareTuples(c, makeColor(0.1, 0.1, 0.1));
});

test('The hit should offset the point', () => {
    const EPSILON = 1e-5;
    const r = new Ray(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const shape = new Sphere();
    shape.transform = translation(0, 0, 1);
    const i = new Intersection(5, shape);
    const comps = i.prepareComputations(r);
    expect(comps.overPoint.z).toBeLessThan(-EPSILON / 2);
    expect(comps.point.z).toBeGreaterThan(comps.overPoint.z);
});