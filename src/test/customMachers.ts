// customMatchers.ts

import { expect } from 'vitest'

expect.extend({
    toApproximatelyEqual(received, expected, epsilon = 1e-6) {
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