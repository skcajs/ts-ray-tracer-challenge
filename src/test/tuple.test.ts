import {expect, test} from 'vitest'
import Tuple, {point, vector} from '../maths/tuple.ts'
import {compareTuples} from "./helpers.ts";

test('A tuple can be create with x,y,z,w', () => {
    const tuple = new Tuple(4.3, -4.2, 3.1, 1.0);
    expect(tuple.x).toBe(4.3);
    expect(tuple.y).toBe(-4.2);
    expect(tuple.z).toBe(3.1);
    expect(tuple.w).toBe(1.0);
});

test('A point is a tuple with w=1.0', () => {
    const p = point(4, -4, 3);
    expect(p.x).toBe(4);
    expect(p.y).toBe(-4);
    expect(p.z).toBe(3);
    expect(p.w).toBe(1);
});

test('A vector is a tuple with w=0.0', () => {
    const point = vector(4, -4, 3);
    expect(point.x).toBe(4);
    expect(point.y).toBe(-4);
    expect(point.z).toBe(3);
    expect(point.w).toBe(0);
});

test('Adding two tuples', () => {
    const tuple1 = new Tuple(3, -2, 5, 1);
    const tuple2 = new Tuple(-2, 3, 1, 0);
    const p1p2 = tuple1.add(tuple2);
    expect(p1p2.x).toBe(1);
    expect(p1p2.y).toBe(1);
    expect(p1p2.z).toBe(6);
    expect(p1p2.w).toBe(1);
});

test('Subtracting two points', () => {
    const p1 = point(3, 2, 1);
    const p2 = point(5, 6, 7);
    const p1p2 = p1.subtract(p2);
    expect(p1p2.x).toBe(-2);
    expect(p1p2.y).toBe(-4);
    expect(p1p2.z).toBe(-6);
    expect(p1p2.w).toBe(0);
});

test('Subtracting a vector from a point', () => {
    const p = point(3, 2, 1);
    const v = vector(5, 6, 7);
    const p1p2 = p.subtract(v);
    expect(p1p2.x).toBe(-2);
    expect(p1p2.y).toBe(-4);
    expect(p1p2.z).toBe(-6);
    expect(p1p2.w).toBe(1);
});

test('Subtracting a vector from a zero vector', () => {
    const zero = new Tuple();
    const v = vector(1, -2, 3);
    const p1p2 = zero.subtract(v);
    expect(p1p2.x).toBe(-1);
    expect(p1p2.y).toBe(2);
    expect(p1p2.z).toBe(-3);
    expect(p1p2.w).toBe(0);
});


test('Multiplying a tuple by a scalar', () => {
    const a = new Tuple(1, -2, 3, -4);
    const b = a.multiply(3.5);
    expect(b.x).toBe(3.5);
    expect(b.y).toBe(-7);
    expect(b.z).toBe(10.5);
    expect(b.w).toBe(-14);
});

test('Multiplying a tuple by a fraction', () => {
    const a = new Tuple(1, -2, 3, -4);
    const b = a.multiply(0.5);
    expect(b.x).toBe(0.5);
    expect(b.y).toBe(-1);
    expect(b.z).toBe(1.5);
    expect(b.w).toBe(-2);
});

test('Dividing a tuple by a scalar', () => {
    const a = new Tuple(1, -2, 3, -4);
    const b = a.divide(2);
    expect(b.x).toBe(0.5);
    expect(b.y).toBe(-1);
    expect(b.z).toBe(1.5);
    expect(b.w).toBe(-2);
});

test('Computing the magnitude of vector(0,1,0)', () => {
    const v = vector(0, 1, 0);
    expect(v.magnitude()).toBe(1);
})

test('Computing the magnitude of vector(0,0,1)', () => {
    const v = vector(0, 0, 1);
    expect(v.magnitude()).toBe(1);
})

test('Computing the magnitude of vector(1,2,3)', () => {
    const v = vector(1, 2, 3);
    expect(v.magnitude()).toBe(Math.sqrt(14));
})

test('Computing the magnitude of vector(-1,-2,-3)', () => {
    const v = vector(-1, -2, -3);
    expect(v.magnitude()).toBe(Math.sqrt(14));
})

test('Normalizing vector(4,0,0)', () => {
    const v = vector(4, 0, 0);
    const nv = v.normalize()
    compareTuples(nv, vector(1, 0, 0))
})

test('Normalizing vector(1,2,3)', () => {
    const v = vector(1, 2, 3);
    const nv = v.normalize()
    const sqrt14 = Math.sqrt(14);
    compareTuples(nv, vector(1 / sqrt14, 2 / sqrt14, 3 / sqrt14))
})

test('The dot product of two tuples', () => {
    const a = vector(1, 2, 3);
    const b = vector(2, 3, 4);
    expect(a.dot(b)).toBe(20);
})

test('The dot product of two vectors', () => {
    const a = vector(1, 2, 3);
    const b = vector(2, 3, 4);
    expect(a.dot(b)).toBe(20);
})

test('Cross product of two vectors', () => {
    const v1 = vector(1, 2, 3);
    const v2 = vector(2, 3, 4);
    compareTuples(v1.cross(v2), vector(-1, 2, -1));
    compareTuples(v2.cross(v1), vector(1, -2, 1));
})

test('Reflecting a vector approaching at 45 degrees', () => {
    const v = vector(1, -1, 0);
    const n = vector(0, 1, 0);
    const r = v.reflect(n);
    expect(r).toEqual(vector(1, 1, 0));
})

test('Reflecting a vector off a slanted surface', () => {
    const v = vector(0, -1, 0);
    const n = vector(Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
    const r = v.reflect(n);
    compareTuples(r, vector(1, 0, 0));
})