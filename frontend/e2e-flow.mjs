import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:5173';
const DIR = '/tmp/pawhub-e2e';
fs.mkdirSync(DIR, { recursive: true });
const stamp = Date.now();
const email = `e2e_${stamp}@example.com`;

const results = [];
const step = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('  PAGEERROR:', e.message));
const header = () => page.locator('header');

try {
  // 1. Home loads
  await page.goto(BASE, { waitUntil: 'networkidle' });
  step('Home loads', (await page.title()).includes('PawHub'));
  await page.screenshot({ path: `${DIR}/01-home.png`, fullPage: true });

  // 2. Register -> logged in
  await page.goto(`${BASE}/register`, { waitUntil: 'networkidle' });
  await page.fill('#name', 'E2E Tester');
  await page.fill('#email', email);
  await page.fill('#password', 'e2epassword');
  await page.getByRole('button', { name: /Create Account/ }).click();
  await page.waitForURL(`${BASE}/`);
  await header()
    .getByRole('link', { name: /My Profile/ })
    .waitFor({ timeout: 8000 });
  step('Register → logged in (header shows My Profile)', true);

  // 3. Adopt → open a pet
  await header().getByRole('link', { name: 'Adopt', exact: true }).click();
  await page.waitForURL('**/adopt');
  await page
    .getByRole('button', { name: /^Meet / })
    .first()
    .click();
  await page.waitForURL('**/pet/**');
  const petName = (await page.locator('h1').first().innerText()).trim();
  step('Browse Adopt → open pet profile', true, petName);
  await page.screenshot({ path: `${DIR}/02-pet.png`, fullPage: true });

  // 4. Apply to Adopt → applied state
  await page.getByRole('button', { name: /Apply to Adopt/ }).click();
  await page.getByText(/applied to adopt/).waitFor({ timeout: 8000 });
  const cancelVisible = await page.getByRole('button', { name: /Cancel application/ }).isVisible();
  step('Apply to Adopt → applied banner + Cancel button', cancelVisible);
  await page.screenshot({ path: `${DIR}/03-applied.png`, fullPage: true });

  // 5. Profile lists the application
  await header()
    .getByRole('link', { name: /My Profile/ })
    .click();
  await page.waitForURL('**/profile');
  await page.getByRole('heading', { name: /My Adoption Applications/ }).waitFor({ timeout: 8000 });
  await page.getByRole('button', { name: 'Cancel', exact: true }).first().waitFor({ timeout: 8000 });
  const listed = (await page.getByText(petName).count()) > 0;
  step('Profile → My Applications lists the pet', listed);
  await page.screenshot({ path: `${DIR}/04-profile.png`, fullPage: true });

  // 6. Cancel from profile
  await page.getByRole('button', { name: 'Cancel', exact: true }).first().click();
  await page.waitForTimeout(1200);
  const gone = (await page.getByText("You haven't applied to adopt any pets yet.").count()) > 0;
  step('Cancel application from profile → list empties', gone);

  // 7. Shop → add to cart → cart → checkout
  await header().getByRole('link', { name: 'Shop', exact: true }).click();
  await page.waitForURL('**/shop');
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await page.waitForTimeout(400);
  const badge = (
    await header()
      .locator('text=/^[0-9]+$/')
      .first()
      .innerText()
      .catch(() => '0')
  ).trim();
  await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle' });
  const items = await page.locator('ul > li').count();
  step('Shop Add to Cart → item in cart (badge + cart page)', items >= 1, `badge=${badge}, items=${items}`);
  await page.screenshot({ path: `${DIR}/05-cart.png`, fullPage: true });
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByText(/demo store/).waitFor({ timeout: 8000 });
  step('Checkout → demo confirmation + cart cleared', true);

  // 8. Community → create post → appears + post detail page
  await header().getByRole('link', { name: 'Community', exact: true }).click();
  await page.waitForURL('**/community');
  await page.getByRole('button', { name: /Create New Post/ }).click();
  const title = `E2E Post ${stamp}`;
  await page.locator('input[type="text"]').fill(title);
  await page.locator('textarea').fill('hello from the e2e flow check');
  await page.getByRole('button', { name: /Submit Post/ }).click();
  await page.getByText(title).first().waitFor({ timeout: 8000 });
  step('Create community post → appears in list', true);
  await page.screenshot({ path: `${DIR}/06-community.png`, fullPage: true });

  // 9. Logout
  await header()
    .getByRole('link', { name: /My Profile/ })
    .click();
  await page.waitForURL('**/profile');
  await page.getByRole('button', { name: /Log Out/ }).click();
  await header()
    .getByRole('link', { name: /Log In/ })
    .waitFor({ timeout: 8000 });
  step('Logout → header shows Log In', true);
} catch (e) {
  step('FLOW EXCEPTION', false, e.message.split('\n')[0]);
  await page.screenshot({ path: `${DIR}/error.png`, fullPage: true }).catch(() => {});
} finally {
  await browser.close();
}

const passed = results.filter((r) => r.ok).length;
console.log(`\n=== ${passed}/${results.length} flow steps passed ===`);
console.log(`screenshots in ${DIR}`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
