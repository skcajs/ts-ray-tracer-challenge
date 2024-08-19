import {expect, test} from 'vitest'
import TestShape from "../shapes/testShape.ts";
import {compareMatrices} from "./helpers.ts";
import Matrix from "../matrix.ts";
import {translation} from "../transformations.ts";
import {material} from "../material.ts";

test('The default transformation', () => {
    const s = new TestShape();
    compareMatrices(s.transform, Matrix.Identity())
});

test('Assigning a transformation', () => {
    const s = new TestShape();
    s.setTransform(translation(2, 3, 4));
    compareMatrices(s.transform, translation(2, 3, 4));
})

test('The default material', () => {
    const s = new TestShape();
    const m = s.material;
    expect(m == material());
})
