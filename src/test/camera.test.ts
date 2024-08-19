import {expect, test} from "vitest";
import {compareMatrices, compareTuples} from "./helpers.ts";
import {identity, rotation, translation, viewTransform} from "../transformations.ts";
import {camera} from "../camera.ts";
import {colour, point, vector} from "../tuple.ts";
import {defaultWorld} from "../world.ts";

const FOV = Math.PI / 2;

test('Constructing a camera', () => {
    const hSize = 160;
    const vSize = 120;
    const fieldOfView = FOV;
    const c = camera(hSize, vSize, fieldOfView);
    expect(c.hSize).toBe(160);
    expect(c.vSize).toBe(120);
    expect(c.fieldOfView).toBe(fieldOfView);
    compareMatrices(c.transform, identity());
});

test('The pixel size for a horizontal canvas', () => {
    const c = camera(200, 125, FOV);
    expect(c.pixelSize).toBeCloseTo(0.01);
});

test('The pixel size for a vertical canvas', () => {
    const c = camera(125, 200, FOV);
    expect(c.pixelSize).toBeCloseTo(0.01);
});

test('Constructing a ray through the center of the canvas', () => {
    const c = camera(201, 101, FOV);
    const r = c.rayForPixel(100, 50);
    compareTuples(r.origin, point(0, 0, 0));
    compareTuples(r.direction, vector(0, 0, -1));
});

test('Constructing a ray through the corner of the canvas', () => {
    const c = camera(201, 101, FOV);
    const r = c.rayForPixel(0, 0);
    compareTuples(r.origin, point(0, 0, 0));
    compareTuples(r.direction, vector(0.66519, 0.33259, -0.66851));
});

test('Constructing a ray when the camera is transformed', () => {
    const c = camera(201, 101, FOV);
    c.transform = rotation(1, Math.PI / 4).multiply(translation(0, -2, 5));
    const r = c.rayForPixel(100, 50);
    compareTuples(r.origin, point(0, 2, -5));
    compareTuples(r.direction, vector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2));
});

test('Rendering the world with a camera', () => {
    const w = defaultWorld();
    const c = camera(11, 11, FOV);
    const from = point(0, 0, -5);
    const to = point(0, 0, 0);
    const up = vector(0, 1, 0);
    c.transform = viewTransform(from, to, up);
    const image = c.render(w);
    const startIndex = (5 * 11 + 5) * 4;
    const cols = image.slice(startIndex, startIndex + 4);
    compareTuples(colour(cols[0], cols[1], cols[2]), colour(0.38066 * 255, 0.47583 * 255, 0.2855 * 255));
});