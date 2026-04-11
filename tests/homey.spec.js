import { test, expect } from '@playwright/test';

test('kirjautumissivu latautuu', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await expect(page.locator('text=Homey')).toBeVisible();
});

test('perhe voi kirjautua sisään', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await page.fill('input[type="email"]', 'sinun@email.fi');
  await page.fill('input[type="password"]', 'sinun_salasanasi');
  await page.click('text=Kirjaudu sisään');
  await expect(page.locator('text=Kuka olet?')).toBeVisible();
});

test('väärä salasana näyttää virheen', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await page.fill('input[type="email"]', 'sinun@email.fi');
  await page.fill('input[type="password"]', 'vaara_salasana');
  await page.click('text=Kirjaudu sisään');
  await expect(page.locator('text=Väärä sähköposti tai salasana')).toBeVisible();
});

test('vanhempi pääsee hallintanäkymään', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await page.fill('input[type="email"]', 'sinun@email.fi');
  await page.fill('input[type="password"]', 'sinun_salasanasi');
  await page.click('text=Kirjaudu sisään');
  await page.click('text=Vanhempi');
  await page.fill('#admin-pin', '1987');
  await expect(page.locator('text=Yleiskuva')).toBeVisible();
});
