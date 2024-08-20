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
    const r = received;
    const ex = expected;
    expect(r.e[0]).toBeCloseTo(ex.e[0]);
    expect(r.e[1]).toBeCloseTo(ex.e[1]);
    expect(r.e[2]).toBeCloseTo(ex.e[2]);
    expect(r.e[3]).toBeCloseTo(ex.e[3]);
    expect(r.e[r.size]).toBeCloseTo(ex.e[ex.size]);
    expect(r.e[r.size + 1]).toBeCloseTo(ex.e[ex.size + 1]);
    expect(r.e[r.size + 2]).toBeCloseTo(ex.e[ex.size + 2]);
    expect(r.e[r.size + 3]).toBeCloseTo(ex.e[ex.size + 3]);
    expect(r.e[2 * r.size]).toBeCloseTo(ex.e[2 * ex.size]);
    expect(r.e[2 * r.size + 1]).toBeCloseTo(ex.e[2 * ex.size + 1]);
    expect(r.e[2 * r.size + 2]).toBeCloseTo(ex.e[2 * ex.size + 2]);
    expect(r.e[2 * r.size + 3]).toBeCloseTo(ex.e[2 * ex.size + 3]);
    expect(r.e[3 * r.size]).toBeCloseTo(ex.e[3 * ex.size]);
    expect(r.e[3 * r.size + 1]).toBeCloseTo(ex.e[3 * ex.size + 1]);
    expect(r.e[3 * r.size + 2]).toBeCloseTo(ex.e[3 * ex.size + 2]);
    expect(r.e[3 * r.size + 3]).toBeCloseTo(ex.e[3 * ex.size + 3]);
}