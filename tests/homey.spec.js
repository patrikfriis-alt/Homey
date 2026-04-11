import { test, expect } from '@playwright/test';

const email = process.env.HOMEY_EMAIL;
const password = process.env.HOMEY_PASSWORD;
const childName = process.env.HOMEY_CHILD_NAME;
const childPin = process.env.HOMEY_CHILD_PIN;

async function loginAsFamily(page) {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await page.click('text=Kirjaudu sisään');
  await page.locator('#fl-email').fill(email);
  await page.locator('#fl-password').fill(password);
  await page.locator('#view-family-login').getByRole('button', { name: 'Kirjaudu sisään' }).click();
  await expect(page.locator('text=Kuka olet?')).toBeVisible();
}

async function loginAsParent(page) {
  await loginAsFamily(page);
  await page.getByRole('button', { name: 'Vanhemman kirjautuminen' }).click();
  for (const digit of process.env.HOMEY_ADMIN_PIN) {
    await page.getByRole('button', { name: digit, exact: true }).first().click();
  }
  await expect(page.locator('text=Yleiskuva')).toBeVisible();
}

async function loginAsChild(page) {
  await loginAsFamily(page);
  await page.getByRole('button', { name: childName }).click();
  for (const digit of childPin) {
    await page.getByRole('button', { name: digit, exact: true }).first().click();
  }
  await expect(page.locator('text=Omat')).toBeVisible();
}

test('kirjautumissivu latautuu', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await expect(page.locator('h1').first()).toBeVisible();
});

test('perhe voi kirjautua sisään', async ({ page }) => {
  await loginAsFamily(page);
});

test('väärä salasana näyttää virheen', async ({ page }) => {
  await page.goto('https://patrikfriis-alt.github.io/Homey');
  await page.click('text=Kirjaudu sisään');
  await page.locator('#fl-email').fill(email);
  await page.locator('#fl-password').fill('vaara_salasana');
  await page.locator('#view-family-login').getByRole('button', { name: 'Kirjaudu sisään' }).click();
  await expect(page.locator('text=Väärä sähköposti tai salasana')).toBeVisible();
});

test('vanhempi pääsee hallintanäkymään', async ({ page }) => {
  await loginAsParent(page);
});

test('lapsi voi kirjautua sisään', async ({ page }) => {
  await loginAsChild(page);
});

test('lapsi näkee omat tehtävät', async ({ page }) => {
  await loginAsChild(page);
  await expect(page.locator('text=Omat')).toBeVisible();
  await expect(page.locator('text=Vapaat')).toBeVisible();
});

test('lapsi voi vaihtaa vapaat tehtävät välilehdelle', async ({ page }) => {
  await loginAsChild(page);
  await page.getByRole('button', { name: 'Vapaat' }).click();
  await expect(page.locator('text=Vapaat')).toBeVisible();
});

test('lapsi näkee historian', async ({ page }) => {
  await loginAsChild(page);
  await page.getByRole('button', { name: 'Historia' }).click();
  await expect(page.locator('text=Historia')).toBeVisible();
});

test('vanhempi näkee tehtävät-välilehden', async ({ page }) => {
  await loginAsParent(page);
  await page.getByRole('button', { name: 'Tehtävät' }).first().click();
  await expect(page.locator('text=Kaikki')).toBeVisible();
});

test('vanhempi näkee maksut-välilehden', async ({ page }) => {
  await loginAsParent(page);
  await page.getByRole('button', { name: 'Maksut' }).click();
  await expect(page.locator('text=Maksut')).toBeVisible();
});

test('vanhempi näkee hallinta-välilehden', async ({ page }) => {
  await loginAsParent(page);
  await page.getByRole('button', { name: 'Hallinta' }).click();
  await expect(page.locator('text=Hallinta')).toBeVisible();
});
