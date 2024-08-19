import {expect, test} from 'vitest'
import {point, vector} from "../tuple.ts";
import Ray from "../ray.ts";
import {scaling, translation} from "../transformations.ts";

test('Creating a querying a ray', () => {
    const origin = point(1, 2, 3);
    const direction = vector(4, 5, 6);

    const ray = new Ray(origin, direction);

    expect(ray.origin).toEqual(origin);
});

test('Computing a point from a distance', () => {
    const r = new Ray(point(2, 3, 4), vector(1, 0, 0));

    let expected = point(2, 3, 4);
    expect(r.position(0)).toEqual(expected);

    expected = point(3, 3, 4);
    expect(r.position(1)).toEqual(expected);

    expected = point(1, 3, 4);
    expect(r.position(-1)).toEqual(expected);

    expected = point(4.5, 3, 4);
    expect(r.position(2.5)).toEqual(expected);
});

test('Translating a ray', () => {
    const r = new Ray(point(1, 2, 3), vector(0, 1, 0));
    const m = translation(3, 4, 5);
    const r2 = r.transform(m);

    expect(r2.origin).toEqual(point(4, 6, 8));
    expect(r2.direction).toEqual(vector(0, 1, 0));
});

test('Scaling a ray', () => {
    const r = new Ray(point(1, 2, 3), vector(0, 1, 0));
    const m = scaling(2, 3, 4);
    const r2 = r.transform(m);

    expect(r2.origin).toEqual(point(2, 6, 12));
    expect(r2.direction).toEqual(vector(0, 3, 0));
});