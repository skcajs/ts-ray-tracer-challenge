import {expect, test} from "vitest";
import {makeRay} from "../ray.ts";
import {makePoint, makeVector} from "../tuple.ts";
import {makeCube} from "../shapes/cube.ts";
import {compareTuples} from "./helpers.ts";

test("A ray intersects a cube", () => {
    const c = makeCube();
    const s = [
        {o: makePoint(5, 0.5, 0), d: makeVector(-1, 0, 0), t1: 4, t2: 6},
        {o: makePoint(-5, 0.5, 0), d: makeVector(1, 0, 0), t1: 4, t2: 6},
        {o: makePoint(0.5, 5, 0), d: makeVector(0, -1, 0), t1: 4, t2: 6},
        {o: makePoint(0.5, -5, 0), d: makeVector(0, 1, 0), t1: 4, t2: 6},
        {o: makePoint(0.5, 0, 5), d: makeVector(0, 0, -1), t1: 4, t2: 6},
        {o: makePoint(0.5, 0, -5), d: makeVector(0, 0, 1), t1: 4, t2: 6},
        {o: makePoint(0, 0.5, 0), d: makeVector(0, 0, 1), t1: -1, t2: 1}
    ];

    for (let i = 0; i < 7; ++i) {
        const r = makeRay(s[i].o, s[i].d);
        const xs = c.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0].t).toBe(s[i].t1);
        expect(xs[1].t).toBe(s[i].t2);
    }
});

test("A ray misses a cube", () => {
    const c = makeCube();
    const s = [
        {o: makePoint(-2, 0, 0), d: makeVector(0.2673, 0.5345, 0.8018)},
        {o: makePoint(0, -2, 0), d: makeVector(0.8018, 0.2673, 0.5345)},
        {o: makePoint(0, 0, -2), d: makeVector(0.5345, 0.8018, 0.2673)},
        {o: makePoint(2, 0, 2), d: makeVector(0, 0, -1)},
        {o: makePoint(0, 2, 2), d: makeVector(0, -1, 0)},
        {o: makePoint(2, 2, 0), d: makeVector(-1, 0, 0)}
    ];

    for (let i = 0; i < 6; ++i) {
        const r = makeRay(s[i].o, s[i].d);
        const xs = c.intersect(r);
        expect(xs.length).toBe(0);
    }
});

test("The normal on a cube", () => {
    const c = makeCube();
    const pn = [
        {p: makePoint(1, 0.5, -0.8), n: makeVector(1, 0, 0)},
        {p: makePoint(-1, -0.2, 0.9), n: makeVector(-1, 0, 0)},
        {p: makePoint(-0.4, 1, -0.1), n: makeVector(0, 1, 0)},
        {p: makePoint(0.3, -1, -0.7), n: makeVector(0, -1, 0)},
        {p: makePoint(-0.6, 0.3, 1), n: makeVector(0, 0, 1)},
        {p: makePoint(0.4, 0.4, -1), n: makeVector(0, 0, -1)},
        {p: makePoint(1, 1, 1), n: makeVector(1, 0, 0)},
        {p: makePoint(-1, -1, -1), n: makeVector(-1, 0, 0)}
    ];

    for (let i = 0; i < 8; ++i) {
        const normal = c.normalAt(pn[i].p);
        compareTuples(normal, pn[i].n);
    }
});