// src/test/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: ['./src/test/vitest.setup.ts'],
    },
});