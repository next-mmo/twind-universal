import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        include: ['packages/todo-universal/routes/**/*.test.ts'],
    },
})
