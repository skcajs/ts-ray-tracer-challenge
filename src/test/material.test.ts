import {expect, test} from 'vitest'
import {makeMaterial} from "../material.ts";
import {makeColor, makePoint, makeVector} from "../tuple.ts";
import PointLight from "../light.ts";

expect.extend({
    toApproximatelyEqual(received, expected, epsilon = 1e-5) {
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

test('The default material', () => {
    const m = makeMaterial();
    expect(m.color).toEqual(makeColor(1, 1, 1));
    expect(m.diffuse).toBe(0.9);
    expect(m.specular).toBe(0.9);
    expect(m.shininess).toBe(200.0);
});

test('Lighting with the eye between the light and the surface', () => {
    const m = makeMaterial();
    const position = makePoint(0, 0, 0);

    const eyeV = makeVector(0, 0, -1);
    const normalV = makeVector(0, 0, -1);
    const light = new PointLight(makePoint(0, 0, -10), makeColor(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    expect(result).toApproximatelyEqual(makeColor(1.9, 1.9, 1.9));
});

test('Lighting with the eye between the light and the surface, eye offset 45 degrees', () => {
    const m = makeMaterial();
    const position = makePoint(0, 0, 0);

    const eyeV = makeVector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    const normalV = makeVector(0, 0, -1);
    const light = new PointLight(makePoint(0, 0, -10), makeColor(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    expect(result).toApproximatelyEqual(makeColor(1.0, 1.0, 1.0));
});

test('Lighting with the eye between the light and the surface, light offset 45 degrees', () => {
    const m = makeMaterial();
    const position = makePoint(0, 0, 0);

    const eyeV = makeVector(0, 0, -1);
    const normalV = makeVector(0, 0, -1);
    const light = new PointLight(makePoint(0, 10, -10), makeColor(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    expect(result).toApproximatelyEqual(makeColor(0.7364, 0.7364, 0.7364));
});

test('Lighting with the eye in the path of the reflection vector', () => {
    const m = makeMaterial();
    const position = makePoint(0, 0, 0);

    const eyeV = makeVector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    const normalV = makeVector(0, 0, -1);
    const light = new PointLight(makePoint(0, 10, -10), makeColor(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    expect(result).toApproximatelyEqual(makeColor(1.6364, 1.6364, 1.6364));
});

test('Lighting with the light behind the surface', () => {
    const m = makeMaterial();
    const position = makePoint(0, 0, 0);

    const eyeV = makeVector(0, 0, -1);
    const normalV = makeVector(0, 0, -1);
    const light = new PointLight(makePoint(0, 10, 10), makeColor(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    expect(result).toApproximatelyEqual(makeColor(0.1, 0.1, 0.1));
});