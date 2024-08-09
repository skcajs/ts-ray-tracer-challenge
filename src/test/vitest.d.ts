// vitest.d.ts
import { Assertion } from 'vitest';

declare module 'vitest' {
    interface Assertion<T = any> {
        toApproximatelyEqual(expected: T, epsilon?: number): void;
    }

    interface AsymmetricMatchersContaining {
        toApproximatelyEqual(expected: unknown, epsilon?: number): void;
    }
}