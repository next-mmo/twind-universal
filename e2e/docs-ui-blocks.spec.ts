import { expect, test } from '@playwright/test'

test('renders the shared block showcase and survives a mobile viewport', async ({ page }) => {
    await page.goto('/ui-blocks')

    await expect(page.getByText('A single verification surface for the new universal block layer.')).toBeVisible()
    await expect(page.getByText('Stats Block', { exact: true })).toBeVisible()
    await expect(page.getByText('Feature Grid', { exact: true })).toBeVisible()
    await expect(page.getByText('Callout Block', { exact: true })).toBeVisible()
    await expect(page.getByText('Summary Panel', { exact: true })).toBeVisible()
    await expect(page.getByText('Surface Grid', { exact: true })).toBeVisible()

    await page.setViewportSize({ width: 390, height: 844 })
    await page.reload()

    await expect(page.getByText('Shared UI Blocks')).toBeVisible()
    await expect(page.getByText('A single verification surface for the new universal block layer.')).toBeVisible()
})
