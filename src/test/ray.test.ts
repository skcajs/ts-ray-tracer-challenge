import { expect, test } from 'vitest'
import {makePoint, makeVector} from "../tuple.ts";
import Ray from "../ray.ts";
import {scaling, translation} from "../transformations.ts";

test('', () => {

});

test('Creating a querying a ray', () => {
    const origin = makePoint(1,2,3);
    const direction = makeVector(4,5,6);

    const ray = new Ray(origin, direction);

    expect(ray.origin).toEqual(origin);
});

test('Computing a point from a distance', () => {
    const r = new Ray(makePoint(2,3,4), makeVector(1,0,0));

    let expected = makePoint(2,3,4);
    expect(r.position(0)).toEqual(expected);

    expected = makePoint(3,3,4);
    expect(r.position(1)).toEqual(expected);

    expected = makePoint(1,3,4);
    expect(r.position(-1)).toEqual(expected);

    expected = makePoint(4.5,3,4);
    expect(r.position(2.5)).toEqual(expected);
});

test('Translating a ray', () => {
    const r = new Ray(makePoint(1,2,3), makeVector(0,1,0));
    const m = translation(3,4,5);
    const r2 = r.transform(m);

    expect(r2.origin).toEqual(makePoint(4,6,8));
    expect(r2.direction).toEqual(makeVector(0,1,0));
});

test('Scaling a ray', () => {
    const r = new Ray(makePoint(1,2,3), makeVector(0,1,0));
    const m = scaling(2,3,4);
    const r2 = r.transform(m);

    expect(r2.origin).toEqual(makePoint(2,6,12));
    expect(r2.direction).toEqual(makeVector(0,3,0));
});