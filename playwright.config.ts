import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    reporter: 'list',
    use: {
        headless: true,
        trace: 'retain-on-failure',
    },
    webServer: [
        {
            command: 'pnpm --filter docs exec vite dev --host 127.0.0.1 --port 3000',
            reuseExistingServer: true,
            timeout: 120_000,
            url: 'http://127.0.0.1:3000',
        },
        {
            command: 'pnpm --filter todo-web exec vite dev --host 127.0.0.1 --port 3001',
            reuseExistingServer: true,
            timeout: 120_000,
            url: 'http://127.0.0.1:3001',
        },
    ],
    projects: [
        {
            name: 'docs',
            testMatch: /docs-ui-blocks\.spec\.ts/,
            use: {
                baseURL: 'http://127.0.0.1:3000',
            },
        },
        {
            name: 'todo-web',
            testMatch: /todo-web\.spec\.ts/,
            use: {
                baseURL: 'http://127.0.0.1:3001',
            },
        },
    ],
})
