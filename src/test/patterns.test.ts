import {test} from "vitest";
import {black, makePoint, white} from "../tuple.ts";
import {compareTuples} from "./helpers.ts";
import {stripePattern} from "../pattern.ts";

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