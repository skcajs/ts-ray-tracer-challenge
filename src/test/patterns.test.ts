import {test} from "vitest";
import {black, makeColor, makePoint, white} from "../tuple.ts";
import {compareMatrices, compareTuples} from "./helpers.ts";
import {makeSphere} from "../shapes/sphere.ts";
import {scaling, translation} from "../transformations.ts";
import {makeStripes} from "../patterns/stripes.ts";
import {makeTestPattern} from "../patterns/testPattern.ts";
import {identity} from "../matrix.ts";
import {makeGradient} from "../patterns/gradient.ts";
import {makeRings} from "../patterns/rings.ts";
import {makeTestShape} from "../shapes/testShape.ts";
import {makeChecker} from "../patterns/checker.ts";

test("Creating a stripe pattern", () => {
    const pattern = makeStripes(white(), black());
    compareTuples(pattern.a, white());
    compareTuples(pattern.b, black());
});

test("A stripe pattern is constant in y", () => {
    const pattern = makeStripes(white(), black());
    compareTuples(pattern.colorAt(makePoint(0, 0, 0), makeSphere()), white());
    compareTuples(pattern.colorAt(makePoint(0, 1, 0), makeSphere()), white());
    compareTuples(pattern.colorAt(makePoint(0, 2, 0), makeSphere()), white());
});

test("A stripe pattern is constant in z", () => {
    const pattern = makeStripes(white(), black());
    compareTuples(pattern.colorAt(makePoint(0, 0, 0), makeSphere()), white());
    compareTuples(pattern.colorAt(makePoint(0, 0, 1), makeSphere()), white());
    compareTuples(pattern.colorAt(makePoint(0, 0, 2), makeSphere()), white());
});

test("A stripe pattern is constant in x", () => {
    const pattern = makeStripes(white(), black());
    compareTuples(pattern.colorAt(makePoint(0, 0, 0), makeSphere()), white());
    compareTuples(pattern.colorAt(makePoint(0.9, 0, 0), makeSphere()), white());
    compareTuples(pattern.colorAt(makePoint(1, 0, 0), makeSphere()), black());
    compareTuples(pattern.colorAt(makePoint(-0.1, 0, 0), makeSphere()), black());
    compareTuples(pattern.colorAt(makePoint(-1, 0, 0), makeSphere()), black());
    compareTuples(pattern.colorAt(makePoint(-1.1, 0, 0), makeSphere()), white());
});

test("The default pattern transformation", () => {
    const pattern = makeTestPattern();
    compareMatrices(pattern.transform, identity());
});

test("Assigning a transformation", () => {
    const pattern = makeTestPattern();
    pattern.setTransform(translation(1, 2, 3))
    compareMatrices(pattern.transform, translation(1, 2, 3));
});

test("A pattern with an object transformation", () => {
    const shape = makeSphere();
    shape.setTransform(scaling(2, 2, 2));
    const pattern = makeTestPattern();
    const c = pattern.colorAt(makePoint(2, 3, 4), shape);
    compareTuples(c, makeColor(1, 1.5, 2));
});

test("A pattern with a pattern transformation", () => {
    const shape = makeSphere();
    const pattern = makeTestPattern();
    pattern.setTransform(scaling(2, 2, 2));
    const c = pattern.colorAt(makePoint(2, 3, 4), shape);
    compareTuples(c, makeColor(1, 1.5, 2));
});

test("A pattern with both an an object and a pattern transformation", () => {
    const shape = makeSphere();
    shape.setTransform(scaling(2, 2, 2));
    const pattern = makeTestPattern();
    pattern.setTransform(translation(0.5, 1, 1.5));
    const c = pattern.colorAt(makePoint(2.5, 3, 3.5), shape);
    compareTuples(c, makeColor(0.75, 0.5, 0.25));
});

test("A gradient that linearly interpolates between colors", () => {
    const pattern = makeGradient(white(), black());
    const shape = makeTestShape();
    compareTuples(pattern.colorAt(makePoint(0, 0, 0), shape), white());
    compareTuples(pattern.colorAt(makePoint(0.25, 0, 0), shape), makeColor(0.75, 0.75, 0.75));
    compareTuples(pattern.colorAt(makePoint(0.5, 0, 0), shape), makeColor(0.5, 0.5, 0.5));
    compareTuples(pattern.colorAt(makePoint(0.75, 0, 0), shape), makeColor(0.25, 0.25, 0.25));
});

test("A ring should extend in both x and z", () => {
    const pattern = makeRings(white(), black());
    const shape = makeTestShape();
    compareTuples(pattern.colorAt(makePoint(0, 0, 0), shape), white());
    compareTuples(pattern.colorAt(makePoint(1, 0, 0), shape), black());
    compareTuples(pattern.colorAt(makePoint(0, 0, 1), shape), black());
});

test("Checkers should repeat in x", () => {
    const pattern = makeChecker(white(), black());
    const shape = makeTestShape();
    compareTuples(pattern.colorAt(makePoint(0, 0, 0), shape), white());
    compareTuples(pattern.colorAt(makePoint(0.99, 0, 0), shape), white());
    compareTuples(pattern.colorAt(makePoint(1.01, 0, 0), shape), black());
})

test("Checkers should repeat in y", () => {
    const pattern = makeChecker(white(), black());
    const shape = makeTestShape();
    compareTuples(pattern.colorAt(makePoint(0, 0, 0), shape), white());
    compareTuples(pattern.colorAt(makePoint(0, 0.99, 0), shape), white());
    compareTuples(pattern.colorAt(makePoint(0, 1.01, 0), shape), black());
})

test("Checkers should repeat in z", () => {
    const pattern = makeChecker(white(), black());
    const shape = makeTestShape();
    compareTuples(pattern.colorAt(makePoint(0, 0, 0), shape), white());
    compareTuples(pattern.colorAt(makePoint(0, 0, 0.99), shape), white());
    compareTuples(pattern.colorAt(makePoint(0, 0, 1.01), shape), black());
})