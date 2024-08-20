import {expect, test} from "vitest";
import {compareMatrices, compareTuples} from "./helpers.ts";
import {identity, rotation, translation, viewTransform} from "../transformations.ts";
import {makeCamera} from "../camera.ts";
import {makeColor, makePoint, makeVector} from "../tuple.ts";
import {defaultWorld} from "../world.ts";

const FOV = Math.PI / 2;

test('Constructing a camera', () => {
    const hSize = 160;
    const vSize = 120;
    const fieldOfView = FOV;
    const c = makeCamera(hSize, vSize, fieldOfView);
    expect(c.hSize).toBe(160);
    expect(c.vSize).toBe(120);
    expect(c.fieldOfView).toBe(fieldOfView);
    compareMatrices(c.transform, identity());
});

test('The pixel size for a horizontal canvas', () => {
    const c = makeCamera(200, 125, FOV);
    expect(c.pixelSize).toBeCloseTo(0.01);
});

test('The pixel size for a vertical canvas', () => {
    const c = makeCamera(125, 200, FOV);
    expect(c.pixelSize).toBeCloseTo(0.01);
});

test('Constructing a ray through the center of the canvas', () => {
    const c = makeCamera(201, 101, FOV);
    const r = c.rayForPixel(100, 50);
    compareTuples(r.origin, makePoint(0, 0, 0));
    compareTuples(r.direction, makeVector(0, 0, -1));
});

test('Constructing a ray through the corner of the canvas', () => {
    const c = makeCamera(201, 101, FOV);
    const r = c.rayForPixel(0, 0);
    compareTuples(r.origin, makePoint(0, 0, 0));
    compareTuples(r.direction, makeVector(0.66519, 0.33259, -0.66851));
});

test('Constructing a ray when the camera is transformed', () => {
    const c = makeCamera(201, 101, FOV);
    c.transform = rotation(1, Math.PI / 4).multiply(translation(0, -2, 5));
    const r = c.rayForPixel(100, 50);
    compareTuples(r.origin, makePoint(0, 2, -5));
    compareTuples(r.direction, makeVector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2));
});

test('Rendering the world with a camera', () => {
    const w = defaultWorld();
    const c = makeCamera(11, 11, FOV);
    const from = makePoint(0, 0, -5);
    const to = makePoint(0, 0, 0);
    const up = makeVector(0, 1, 0);
    c.transform = viewTransform(from, to, up);
    const image = c.render(w);
    const startIndex = (5 * 11 + 5) * 4;
    const cols = image.slice(startIndex, startIndex + 4);
    compareTuples(makeColor(cols[0], cols[1], cols[2]), makeColor(0.38066 * 255, 0.47583 * 255, 0.2855 * 255));
});