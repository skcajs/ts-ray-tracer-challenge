import {expect, test} from 'vitest'
import {colour, point} from "../tuple.ts";
import PointLight from "../light.ts";

test('A point light has a position and intensity', () => {
    const intensity = colour(1, 1, 1);
    const position = point(0, 0, 0);
    const light = new PointLight(position, intensity);
    expect(light.position).toEqual(position);
    expect(light.intensity).toEqual(intensity);
})