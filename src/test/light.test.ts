import {expect, test} from 'vitest'
import {makeColor, makePoint} from "../tuple.ts";
import PointLight from "../light.ts";

test('A point light has a position and intensity', () => {
    const intensity = makeColor(1, 1, 1);
    const position = makePoint(0, 0, 0);
    const light = new PointLight(position, intensity);
    expect(light.position).toEqual(position);
    expect(light.intensity).toEqual(intensity);
})