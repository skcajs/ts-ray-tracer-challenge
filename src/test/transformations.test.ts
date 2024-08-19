import {expect, test} from 'vitest'
import {translation, rotation, scaling, shearing, viewTransform} from "../transformations.ts";
import {point, vector} from "../tuple.ts";
import {compareMatrices, compareTuples} from "./helpers.ts";
import Matrix from "../matrix.ts";

test('Multiplying by a translation matrix', () => {
    const transform = translation(5, -3, 2);
    const p = point(-3, 4, 5);

    const expected = point(2, 1, 7);

    compareTuples(transform.multiplyTuple(p), expected);
    compareTuples(p.translate(5, -3, 2), expected);
});

test('Multiplying by the inverse of a translation matrix', () => {
    const transform = translation(5, -3, 2);
    const inv = transform.inverse();
    const p = point(-3, 4, 5);

    const expected = point(-8, 7, 3);

    compareTuples(inv.multiplyTuple(p), expected);
});

test('Translation does not effect vectors', () => {
    const transform = translation(5, -3, 2);
    const v = vector(-3, 4, 5);

    compareTuples(transform.multiplyTuple(v), v);
});

test('A scaling matrix applied to a point', () => {
    const transform = scaling(2, 3, 4);
    const p = point(-4, 6, 8);

    const expected = point(-8, 18, 32);

    compareTuples(transform.multiplyTuple(p), expected);
    compareTuples(p.scale(2, 3, 4), expected);
});

test('A scaling matrix applied to a vector', () => {
    const transform = scaling(2, 3, 4);
    const v = vector(-4, 6, 8);

    const expected = vector(-8, 18, 32);

    expect(transform.multiplyTuple(v)).toEqual(expected);
    expect(v.scale(2, 3, 4)).toEqual(expected);
});

test('Multiplying by the inverse of a scaling matrix', () => {
    const transform = scaling(2, 3, 4);
    const inv = transform.inverse();
    const v = vector(-4, 6, 8);

    const expected = vector(-2, 2, 2);

    expect(inv.multiplyTuple(v)).toEqual(expected);
});

test('Reflection is scaling by a negative value', () => {
    const transform = scaling(-1, 1, 1);
    const p = point(2, 3, 4);

    const expected = point(-2, 3, 4);

    expect(transform.multiplyTuple(p)).toEqual(expected);
    expect(p.scale(-1, 1, 1)).toEqual(expected);
});

test('Rotating a point around the x axis', () => {
    const p = point(0, 1, 0);
    const halfQuarter = rotation(0, Math.PI / 4);
    const fullQuarter = rotation(0, Math.PI / 2);

    const expected1 = point(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    const expected2 = point(0, 0, 1);

    compareTuples(halfQuarter.multiplyTuple(p), expected1);
    compareTuples(p.rotate(0, Math.PI / 4), expected1);
    compareTuples(fullQuarter.multiplyTuple(p), expected2);
    compareTuples(p.rotate(0, Math.PI / 2), expected2);
});

test('The inverse of an x rotation rotates in the opposite direction', () => {
    const p = point(0, 1, 0);
    const halfQuarter = rotation(0, Math.PI / 4);
    const inv = halfQuarter.inverse();

    const expected = point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);

    compareTuples(inv.multiplyTuple(p), expected);
});

test('Rotating a point around the y axis', () => {
    const p = point(0, 0, 1);
    const halfQuarter = rotation(1, Math.PI / 4);
    const fullQuarter = rotation(1, Math.PI / 2);

    const expected1 = point(Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2);
    const expected2 = point(1, 0, 0);

    compareTuples(halfQuarter.multiplyTuple(p), expected1);
    compareTuples(fullQuarter.multiplyTuple(p), expected2);
});

test('Rotating a point around the z axis', () => {
    const p = point(0, 1, 0);
    const halfQuarter = rotation(2, Math.PI / 4);
    const fullQuarter = rotation(2, Math.PI / 2);

    const expected1 = point(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
    const expected2 = point(-1, 0, 0);

    compareTuples(halfQuarter.multiplyTuple(p), expected1);
    compareTuples(fullQuarter.multiplyTuple(p), expected2);
});

test('A shearing transformation moves x in proportion to y', () => {
    const transform = shearing(1, 0, 0, 0, 0, 0);
    const p = point(2, 3, 4);

    const expected = point(5, 3, 4);

    compareTuples(transform.multiplyTuple(p), expected);
    compareTuples(p.shear(1, 0, 0, 0, 0, 0), expected);
});

test('A shearing transformation moves x in proportion to z', () => {
    const transform = shearing(0, 1, 0, 0, 0, 0);
    const p = point(2, 3, 4);

    const expected = point(6, 3, 4);

    compareTuples(transform.multiplyTuple(p), expected);
    compareTuples(p.shear(0, 1, 0, 0, 0, 0), expected);
});

test('A shearing transformation moves y in proportion to x', () => {
    const transform = shearing(0, 0, 1, 0, 0, 0);
    const p = point(2, 3, 4);

    const expected = point(2, 5, 4);

    compareTuples(transform.multiplyTuple(p), expected);
    compareTuples(p.shear(0, 0, 1, 0, 0, 0), expected);
});

test('A shearing transformation moves y in proportion to z', () => {
    const transform = shearing(0, 0, 0, 1, 0, 0);
    const p = point(2, 3, 4);

    const expected = point(2, 7, 4);

    compareTuples(transform.multiplyTuple(p), expected);
    compareTuples(p.shear(0, 0, 0, 1, 0, 0), expected);
});

test('A shearing transformation moves z in proportion to x', () => {
    const transform = shearing(0, 0, 0, 0, 1, 0);
    const p = point(2, 3, 4);

    const expected = point(2, 3, 6);

    compareTuples(transform.multiplyTuple(p), expected);
    compareTuples(p.shear(0, 0, 0, 0, 1, 0), expected);
});

test('A shearing transformation moves z in proportion to y', () => {
    const transform = shearing(0, 0, 0, 0, 0, 1);
    const p = point(2, 3, 4);

    const expected = point(2, 3, 7);

    compareTuples(transform.multiplyTuple(p), expected);
    compareTuples(p.shear(0, 0, 0, 0, 0, 1), expected);
});

test('Individual transformations are applied in sequence', () => {
    const p = point(1, 0, 1);
    const A = rotation(0, Math.PI / 2);
    const B = scaling(5, 5, 5);
    const C = translation(10, 5, 7);

    const p2 = A.multiplyTuple(p)
    const expected1 = point(1, -1, 0);
    compareTuples(p2, expected1);

    const p3 = B.multiplyTuple(p2);
    const expected2 = point(5, -5, 0);
    compareTuples(p3, expected2);

    const p4 = C.multiplyTuple(p3);
    const expected3 = point(15, 0, 7);
    compareTuples(p4, expected3);
});

test('Chained rotations must be applied in reverse order', () => {
    const p = point(1, 0, 1);
    const A = rotation(0, Math.PI / 2);
    const B = scaling(5, 5, 5);
    const C = translation(10, 5, 7);

    const T = C.multiply(B).multiply(A);
    const expected = point(15, 0, 7);
    compareTuples(T.multiplyTuple(p), expected);
});

test('Chained rotations must be applied in reverse order compact notation', () => {
    const p = point(1, 0, 1);

    const expected = point(15, 0, 7);
    compareTuples(p.rotate(0, Math.PI / 2).scale(5, 5, 5).translate(10, 5, 7), expected);
});

test('The transformation matrix for the default orientation', () => {
    const from = point(0, 0, 0);
    const to = point(0, 0, -1);
    const up = vector(0, 1, 0);
    const t = viewTransform(from, to, up);
    compareMatrices(t, Matrix.Identity());
});

test('A view transformation matrix looking in the positive z direction', () => {
    const from = point(0, 0, 0);
    const to = point(0, 0, 1);
    const up = vector(0, 1, 0);
    const t = viewTransform(from, to, up);
    compareMatrices(t, scaling(-1, 1, -1));
});

test('The view transformation moves the world', () => {
    const from = point(0, 0, 8);
    const to = point(0, 0, 0);
    const up = vector(0, 1, 0);
    const t = viewTransform(from, to, up);

    compareMatrices(t, translation(0, 0, -8));
});

test('An arbitrary view transformation', () => {
    const from = point(1, 3, 2);
    const to = point(4, -2, 8);
    const up = vector(1, 1, 0);
    const t = viewTransform(from, to, up);
    const expected = new Matrix([
        [-0.50709, 0.50709, 0.67612, -2.36643],
        [0.76772, 0.60609, 0.12122, -2.82843],
        [-0.35857, 0.59761, -0.71714, 0.00000],
        [0.00000, 0.00000, 0.00000, 1.00000]
    ]);

    compareMatrices(t, expected);
});