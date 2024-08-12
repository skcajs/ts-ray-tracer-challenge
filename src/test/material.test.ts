import {expect, test} from 'vitest'
import {makeMaterial} from "../material.ts";
import {colour, point, vector} from "../maths/tuple.ts";
import PointLight from "../light.ts";
import {compareTuples} from "./helpers.ts";

test('The default material', () => {
    const m = makeMaterial();
    expect(m.color).toEqual(colour(1, 1, 1));
    expect(m.diffuse).toBe(0.9);
    expect(m.specular).toBe(0.9);
    expect(m.shininess).toBe(200.0);
});

test('Lighting with the eye between the light and the surface', () => {
    const m = makeMaterial();
    const position = point(0, 0, 0);

    const eyeV = vector(0, 0, -1);
    const normalV = vector(0, 0, -1);
    const light = new PointLight(point(0, 0, -10), colour(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    compareTuples(result, colour(1.9, 1.9, 1.9));
});

test('Lighting with the eye between the light and the surface, eye offset 45 degrees', () => {
    const m = makeMaterial();
    const position = point(0, 0, 0);

    const eyeV = vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    const normalV = vector(0, 0, -1);
    const light = new PointLight(point(0, 0, -10), colour(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    compareTuples(result, colour(1.0, 1.0, 1.0));
});

test('Lighting with the eye between the light and the surface, light offset 45 degrees', () => {
    const m = makeMaterial();
    const position = point(0, 0, 0);

    const eyeV = vector(0, 0, -1);
    const normalV = vector(0, 0, -1);
    const light = new PointLight(point(0, 10, -10), colour(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    compareTuples(result, colour(0.7364, 0.7364, 0.7364));
});

test('Lighting with the eye in the path of the reflection vector', () => {
    const m = makeMaterial();
    const position = point(0, 0, 0);

    const eyeV = vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    const normalV = vector(0, 0, -1);
    const light = new PointLight(point(0, 10, -10), colour(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    compareTuples(result, colour(1.6364, 1.6364, 1.6364));
});

test('Lighting with the light behind the surface', () => {
    const m = makeMaterial();
    const position = point(0, 0, 0);

    const eyeV = vector(0, 0, -1);
    const normalV = vector(0, 0, -1);
    const light = new PointLight(point(0, 10, 10), colour(1, 1, 1));
    const result = m.lighting(light, position, eyeV, normalV);
    compareTuples(result, colour(0.1, 0.1, 0.1));
});

test('Lighting with the surface in shadow', () => {
    const m = makeMaterial();
    const position = point(0, 0, 0);

    const eyeV = vector(0, 0, -1);
    const normalV = vector(0, 0, -1);
    const light = new PointLight(point(0, 0, -10), colour(1, 1, 1));
    const inShadow = true;
    const result = m.lighting(light, position, eyeV, normalV, inShadow);
    compareTuples(result, colour(0.1, 0.1, 0.1));
});