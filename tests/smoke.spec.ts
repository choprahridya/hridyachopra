import { test, expect } from '@playwright/test';

test('home page loads with wordmark', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav a').first()).toBeVisible();
  await expect(page.locator('text=Portfolio')).toBeVisible();
});

test('projects page loads', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('h1')).toBeVisible();
});

test('about page loads with contact section', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
});

test('nav links are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav').getByRole('link', { name: /projects/i })).toBeVisible();
  await expect(page.locator('nav').getByRole('link', { name: /about/i })).toBeVisible();
});

test('theme toggle switches dark class', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: /toggle theme/i }).click();
  await expect(html).toHaveClass(/dark/);
});
