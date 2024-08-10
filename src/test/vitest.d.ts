// vitest.d.ts
// import {Assertion} from 'vitest';

// declare module 'vitest' {
//     interface Assertion<T = any> {
//         toApproximatelyEqual(expected: T, epsilon?: number): void;
//     }
//
//     interface AsymmetricMatchersContaining {
//         toApproximatelyEqual(expected: unknown, epsilon?: number): void;
//     }
// }

export {}

interface CustomMatchers<R = unknown> {
    toApproximatelyEqual: (expected: T, epsilon?: number) => R
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> {
    }

    interface AsymmetricMatchersContaining extends CustomMatchers {
    }
}