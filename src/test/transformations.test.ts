import { expect, test } from 'vitest'
import { translation, rotation, scaling, shearing } from "../transformations.ts";
import { makePoint, makeVector} from "../tuple.ts";

expect.extend({
    toApproximatelyEqual(received, expected, epsilon = 1e-6) {
        const pass =
            Math.abs(received.x - expected.x) < epsilon &&
            Math.abs(received.y - expected.y) < epsilon &&
            Math.abs(received.z - expected.z) < epsilon &&
            Math.abs(received.w - expected.w) < epsilon;

        if (pass) {
            return {
                message: () => `expected ${received} not to be close to ${expected}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be close to ${expected}`,
                pass: false,
            };
        }
    },
});

test('Multiplying by a translation matrix', () => {
    const transform = translation(5, -3, 2);
    const p = makePoint(-3,4,5);

    const expected = makePoint(2,1,7);

    expect(transform.multiplyTuple(p)).toEqual(expected)
});

test('Multiplying by the inverse of a translation matrix', () => {
    const transform = translation(5, -3, 2);
    const inv = transform.inverse();
    const p = makePoint(-3,4,5);

    const expected = makePoint(-8,7,3);

    expect(inv.multiplyTuple(p)).toEqual(expected);
});

test('Translation does not effect vectors', () => {
    const transform = translation(5, -3, 2);
    const v = makeVector(-3,4,5);

    expect(transform.multiplyTuple(v)).toEqual(v);
});

test('A scaling matrix applied to a point', () => {
    const transform = scaling(2, 3, 4);
    const p = makePoint(-4,6,8);

    const expected = makePoint(-8,18,32);

    expect(transform.multiplyTuple(p)).toEqual(expected)
});

test('A scaling matrix applied to a vector', () => {
    const transform = scaling(2, 3, 4);
    const v = makeVector(-4,6,8);

    const expected = makeVector(-8,18,32);

    expect(transform.multiplyTuple(v)).toEqual(expected)
});

test('Multiplying by the inverse of a scaling matrix', () => {
    const transform = scaling(2, 3, 4);
    const inv = transform.inverse();
    const v = makeVector(-4,6,8);

    const expected = makeVector(-2,2,2);

    expect(inv.multiplyTuple(v)).toEqual(expected)
});

test('Reflection is scaling by a negative value', () => {
    const transform = scaling(-1, 1, 1);
    const p = makePoint(2,3,4);

    const expected = makePoint(-2,3,4);

    expect(transform.multiplyTuple(p)).toEqual(expected)
});

test('Rotating a point around the x axis', () => {
    const p = makePoint(0,1,0);
    const halfQuarter = rotation(0, Math.PI/4);
    const fullQuarter = rotation(0, Math.PI/2);

    const expected1 = makePoint(0,Math.sqrt(2)/2,Math.sqrt(2)/2);
    const expected2 = makePoint(0,0,1);

    expect(halfQuarter.multiplyTuple(p)).toApproximatelyEqual(expected1);
    expect(fullQuarter.multiplyTuple(p)).toApproximatelyEqual(expected2);
});

test('The inverse of an x rotation rotates in the opposite direction', () => {
    const p = makePoint(0,1,0);
    const halfQuarter = rotation(0, Math.PI/4);
    const inv = halfQuarter.inverse();

    const expected = makePoint(0,Math.sqrt(2)/2,-Math.sqrt(2)/2);

    expect(inv.multiplyTuple(p)).toApproximatelyEqual(expected);
});

test('Rotating a point around the y axis', () => {
    const p = makePoint(0,0,1);
    const halfQuarter = rotation(1, Math.PI/4);
    const fullQuarter = rotation(1, Math.PI/2);

    const expected1 = makePoint(Math.sqrt(2)/2,0,Math.sqrt(2)/2);
    const expected2 = makePoint(1,0,0);

    expect(halfQuarter.multiplyTuple(p)).toApproximatelyEqual(expected1);
    expect(fullQuarter.multiplyTuple(p)).toApproximatelyEqual(expected2);
});

test('Rotating a point around the z axis', () => {
    const p = makePoint(0,1,0);
    const halfQuarter = rotation(2, Math.PI/4);
    const fullQuarter = rotation(2, Math.PI/2);

    const expected1 = makePoint(-Math.sqrt(2)/2,Math.sqrt(2)/2, 0);
    const expected2 = makePoint(-1,0,0);

    expect(halfQuarter.multiplyTuple(p)).toApproximatelyEqual(expected1);
    expect(fullQuarter.multiplyTuple(p)).toApproximatelyEqual(expected2);
});

test('A shearing transformation moves x in proportion to y', () => {
    const transform = shearing(1, 0, 0, 0 ,0, 0);
    const p = makePoint(2,3,4);

    const expected = makePoint(5,3,4);

    expect(transform.multiplyTuple(p)).toApproximatelyEqual(expected);
});

test('A shearing transformation moves x in proportion to z', () => {
    const transform = shearing(0, 1, 0, 0 ,0, 0);
    const p = makePoint(2,3,4);

    const expected = makePoint(6,3,4);

    expect(transform.multiplyTuple(p)).toApproximatelyEqual(expected);
});

test('A shearing transformation moves y in proportion to x', () => {
    const transform = shearing(0, 0, 1, 0 ,0, 0);
    const p = makePoint(2,3,4);

    const expected = makePoint(2,5,4);

    expect(transform.multiplyTuple(p)).toApproximatelyEqual(expected);
});

test('A shearing transformation moves y in proportion to z', () => {
    const transform = shearing(0, 0, 0, 1 ,0, 0);
    const p = makePoint(2,3,4);

    const expected = makePoint(2,7,4);

    expect(transform.multiplyTuple(p)).toApproximatelyEqual(expected);
});

test('A shearing transformation moves z in proportion to x', () => {
    const transform = shearing(0, 0, 0, 0 ,1, 0);
    const p = makePoint(2,3,4);

    const expected = makePoint(2,3,6);

    expect(transform.multiplyTuple(p)).toApproximatelyEqual(expected);
});

test('A shearing transformation moves z in proportion to y', () => {
    const transform = shearing(0, 0, 0, 0 ,0, 1);
    const p = makePoint(2,3,4);

    const expected = makePoint(2,3,7);

    expect(transform.multiplyTuple(p)).toApproximatelyEqual(expected);
});

test('Individual transformations are applied in sequence', () => {
    const p = makePoint(1,0,1);
    const A = rotation(0, Math.PI/2);
    const B = scaling(5,5,5);
    const C = translation(10, 5,7);

    const p2 = A.multiplyTuple(p)
    const expected1 = makePoint(1, -1, 0);
    expect(p2).toApproximatelyEqual(expected1);

    const p3 = B.multiplyTuple(p2);
    const expected2 = makePoint(5, -5, 0);
    expect(p3).toApproximatelyEqual(expected2);

    const p4 = C.multiplyTuple(p3);
    const expected3 = makePoint(15, 0, 7);
    expect(p4).toApproximatelyEqual(expected3);
});

test('Chained rotations must be applied in reverse order', () => {
    const p = makePoint(1,0,1);
    const A = rotation(0, Math.PI/2);
    const B = scaling(5,5,5);
    const C = translation(10, 5,7);

    const T = C.multiply(B).multiply(A);
    const expected = makePoint(15, 0, 7);
    expect(T.multiplyTuple(p)).toApproximatelyEqual(expected);
});