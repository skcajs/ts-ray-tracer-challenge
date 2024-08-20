import {test} from "vitest";
import {black, makePoint, white} from "../tuple.ts";
import {compareTuples} from "./helpers.ts";
import {stripePattern} from "../pattern.ts";
import {makeSphere} from "../shapes/sphere.ts";
import {scaling, translation} from "../transformations.ts";

test("Creating a stripe pattern", () => {
    const pattern = stripePattern(white(), black());
    compareTuples(pattern.a, white());
    compareTuples(pattern.b, black());
});

test("A stripe pattern is constant in y", () => {
    const pattern = stripePattern(white(), black());
    compareTuples(pattern.colorAt(makePoint(0, 0, 0)), white());
    compareTuples(pattern.colorAt(makePoint(0, 1, 0)), white());
    compareTuples(pattern.colorAt(makePoint(0, 2, 0)), white());
});

test("A stripe pattern is constant in z", () => {
    const pattern = stripePattern(white(), black());
    compareTuples(pattern.colorAt(makePoint(0, 0, 0)), white());
    compareTuples(pattern.colorAt(makePoint(0, 0, 1)), white());
    compareTuples(pattern.colorAt(makePoint(0, 0, 2)), white());
});

test("A stripe pattern is constant in x", () => {
    const pattern = stripePattern(white(), black());
    compareTuples(pattern.colorAt(makePoint(0, 0, 0)), white());
    compareTuples(pattern.colorAt(makePoint(0.9, 0, 0)), white());
    compareTuples(pattern.colorAt(makePoint(1, 0, 0)), black());
    compareTuples(pattern.colorAt(makePoint(-0.1, 0, 0)), black());
    compareTuples(pattern.colorAt(makePoint(-1, 0, 0)), black());
    compareTuples(pattern.colorAt(makePoint(-1.1, 0, 0)), white());
});

test("Stripes with an object transformation", () => {
    const object = makeSphere();
    object.setTransform(scaling(2, 2, 2));
    const pattern = stripePattern(white(), black());
    const c = pattern.colorAtObject(makePoint(1.5, 0, 0), object);
    compareTuples(c, white());
});

test("Stripes with a pattern transformation", () => {
    const object = makeSphere();
    const pattern = stripePattern(white(), black());
    pattern.setTransform(scaling(2, 2, 2));
    const c = pattern.colorAtObject(makePoint(1.5, 0, 0), object);
    compareTuples(c, white());
});

test("Stripes with both an object and a pattern transformation", () => {
    const object = makeSphere();
    object.setTransform(scaling(2, 2, 2));
    const pattern = stripePattern(white(), black());
    pattern.setTransform(translation(0.5, 0, 0));
    const c = pattern.colorAtObject(makePoint(2.5, 0, 0), object);
    compareTuples(c, white());
});