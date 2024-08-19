import {expect} from "vitest";
import Tuple from "../tuple.ts";
import Matrix from "../matrix.ts";

export function compareTuples(expected: Tuple, received: Tuple) {
    expect(received.x).toBeCloseTo(expected.x);
    expect(received.y).toBeCloseTo(expected.y);
    expect(received.z).toBeCloseTo(expected.z);
    expect(received.w).toBeCloseTo(expected.w);
}

export function compareMatrices(expected: Matrix, received: Matrix) {
    expect(received.elements[0][0]).toBeCloseTo(expected.elements[0][0]);
    expect(received.elements[0][1]).toBeCloseTo(expected.elements[0][1]);
    expect(received.elements[0][2]).toBeCloseTo(expected.elements[0][2]);
    expect(received.elements[0][3]).toBeCloseTo(expected.elements[0][3]);
    expect(received.elements[1][0]).toBeCloseTo(expected.elements[1][0]);
    expect(received.elements[1][1]).toBeCloseTo(expected.elements[1][1]);
    expect(received.elements[1][2]).toBeCloseTo(expected.elements[1][2]);
    expect(received.elements[1][3]).toBeCloseTo(expected.elements[1][3]);
    expect(received.elements[2][0]).toBeCloseTo(expected.elements[2][0]);
    expect(received.elements[2][1]).toBeCloseTo(expected.elements[2][1]);
    expect(received.elements[2][2]).toBeCloseTo(expected.elements[2][2]);
    expect(received.elements[2][3]).toBeCloseTo(expected.elements[2][3]);
    expect(received.elements[3][0]).toBeCloseTo(expected.elements[3][0]);
    expect(received.elements[3][1]).toBeCloseTo(expected.elements[3][1]);
    expect(received.elements[3][2]).toBeCloseTo(expected.elements[3][2]);
    expect(received.elements[3][3]).toBeCloseTo(expected.elements[3][3]);
}