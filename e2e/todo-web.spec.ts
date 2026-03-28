import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.clear()
    })
})

test('renders the todo list and the migrated stats blocks', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Todos').first()).toBeVisible()
    await expect(page.getByText('Ship stable release')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Loader stats' })).toBeVisible()

    await page.goto('/todo/stats')

    await expect(page.getByText('Route Stats')).toBeVisible()
    await expect(page.getByText('Loader Snapshot', { exact: true })).toBeVisible()
    await expect(page.getByText('Derived Metrics', { exact: true })).toBeVisible()
    await expect(page.getByText('Shared summary block usage inside the universal app flow')).toBeVisible()
})
