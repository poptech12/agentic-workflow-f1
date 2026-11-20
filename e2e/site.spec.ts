import { expect, test } from '@playwright/test'

test('home shows the last race and links to its results', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Last race:/ })).toBeVisible()
  await page.getByRole('link', { name: 'Full results' }).click()
  await expect(page).toHaveURL(/\/races\/24$/)
  await expect(page.getByRole('table')).toBeVisible()
})

test('calendar lists the season and opens a race', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Calendar' }).click()
  await expect(page.getByRole('row')).toHaveCount(25)
  await page.getByRole('link', { name: 'Australian Grand Prix' }).click()
  await expect(page.getByRole('heading', { name: 'Australian Grand Prix' })).toBeVisible()
  await expect(page.getByRole('row')).toHaveCount(21)
})

test('unknown race shows a not-found message', async ({ page }) => {
  await page.goto('/races/99')
  await expect(page.getByRole('heading', { name: 'Race not found' })).toBeVisible()
})

test('constructor standings lists the leader first and home shows leader points', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Constructor leader')).toContainText('points')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Constructors' }).click()
  await expect(page).toHaveURL(/\/standings\/constructors$/)
  await expect(page.getByRole('heading', { name: 'Constructor standings' })).toBeVisible()
  await expect(page.getByRole('row').nth(1).getByRole('cell').first()).toHaveText('1')
})

test('driver standings lists the season leader first', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Drivers' }).click()
  await expect(page).toHaveURL(/\/standings\/drivers$/)
  await expect(page.getByRole('heading', { name: 'Driver standings' })).toBeVisible()
  const first = page.getByRole('row').nth(1)
  await expect(first.getByRole('cell').first()).toHaveText('1')
})
