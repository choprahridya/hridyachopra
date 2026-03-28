import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Home page
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshot-home.png', fullPage: true });
  console.log('✓ Home page screenshot saved');

  // Work page
  await page.goto('http://localhost:3001/work');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshot-work.png', fullPage: false });
  console.log('✓ Work page screenshot saved');

  // Case study
  await page.goto('http://localhost:3001/work/1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshot-case-study.png', fullPage: true });
  console.log('✓ Case study screenshot saved');

  // About page
  await page.goto('http://localhost:3001/about');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshot-about.png', fullPage: true });
  console.log('✓ About page screenshot saved');

  // Contact page
  await page.goto('http://localhost:3001/contact');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshot-contact.png', fullPage: true });
  console.log('✓ Contact page screenshot saved');

  await browser.close();
  console.log('\n✅ All screenshots saved to /public directory');
}

takeScreenshots();
