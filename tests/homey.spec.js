import { test, expect } from '@playwright/test';

test('kirjautumissivu latautuu', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await expect(page.locator('h1').first()).toBeVisible();
});

test('perhe voi kirjautua sisään', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await page.click('text=Kirjaudu sisään');
  await page.locator('#fl-email').fill('sinun@email.fi');
  await page.locator('#fl-password').fill('sinun_salasanasi');
  await page.locator('#view-family-login').getByRole('button', { name: 'Kirjaudu sisään' }).click();
  await expect(page.locator('text=Kuka olet?')).toBeVisible();
});

test('väärä salasana näyttää virheen', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await page.click('text=Kirjaudu sisään');
  await page.locator('#fl-email').fill('sinun@email.fi');
  await page.locator('#fl-password').fill('vaara_salasana');
  await page.locator('#view-family-login').getByRole('button', { name: 'Kirjaudu sisään' }).click();
  await expect(page.locator('text=Väärä sähköposti tai salasana')).toBeVisible();
});

test('vanhempi pääsee hallintanäkymään', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await page.click('text=Kirjaudu sisään');
  await page.locator('#fl-email').fill('sinun@email.fi');
  await page.locator('#fl-password').fill('sinun_salasanasi');
  await page.locator('#view-family-login').getByRole('but
