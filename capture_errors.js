const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('FAILED REQUEST:', response.url(), response.status());
    }
  });

  try {
    console.log('Navigating to http://localhost:5173/');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    console.log('Navigation complete');

    // Check if we are redirected to login
    const url = page.url();
    console.log('Current URL:', url);

    // We can also check if there is an error strictly on the screen
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    if (bodyHTML.includes('Error') || bodyHTML.includes('failed')) {
      console.log('Page body contains error text');
    }
  } catch (err) {
    console.error('Puppeteer Script Error:', err);
  } finally {
    await browser.close();
  }
})();
