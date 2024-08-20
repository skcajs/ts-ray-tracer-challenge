import {expect, test} from 'vitest'
import {compareMatrices, compareTuples} from "./helpers.ts";
import Matrix from "../matrix.ts";
import {rotation, scaling, translation} from "../transformations.ts";
import {material} from "../material.ts";
import {makeRay} from "../ray.ts";
import {makePoint, makeVector} from "../tuple.ts";
import {testShape} from "../shapes/testShape.ts";

test('The default transformation', () => {
    const s = testShape();
    compareMatrices(s.transform, Matrix.Identity())
});

test('Assigning a transformation', () => {
    const s = testShape();
    s.setTransform(translation(2, 3, 4));
    compareMatrices(s.transform, translation(2, 3, 4));
})

test('The default material', () => {
    const s = testShape();
    const m = s.material;
    expect(m).toEqual(material());
})

test('Assigning a material', () => {
    const s = testShape();
    const m = s.material;
    m.ambient = 1;
    s.material = m;
    expect(s.material).toEqual(m);
})

test('Intersecting a scaled shape with a ray', () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = testShape();
    s.setTransform(scaling(2, 2, 2));
    s.intersect(r);
    expect(s.savedRay?.origin).toEqual(makePoint(0, 0, -2.5));
    expect(s.savedRay?.direction).toEqual(makeVector(0, 0, 0.5));
})

test('Intersecting a translated shape with a ray', () => {
    const r = makeRay(makePoint(0, 0, -5), makeVector(0, 0, 1));
    const s = testShape();
    s.setTransform(translation(5, 0, 0));
    s.intersect(r);
    expect(s.savedRay?.origin).toEqual(makePoint(-5, 0, -5));
    expect(s.savedRay?.direction).toEqual(makeVector(0, 0, 1));
})

test('Computing the normal on a translated shape', () => {
    const s = testShape();
    s.setTransform(translation(0, 1, 0));
    const n = s.normalAt(makePoint(0, 1.70711, -0.70711));
    compareTuples(n, makeVector(0, 0.70711, -0.70711));
})

test('Computing the normal on a transformed shape', () => {
    const s = testShape();
    const m = scaling(1, 0.5, 1).multiply(rotation(2, Math.PI / 5));
    s.setTransform(m);
    const n = s.normalAt(makePoint(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
    compareTuples(n, makeVector(0, 0.97014, -0.24254));
})
