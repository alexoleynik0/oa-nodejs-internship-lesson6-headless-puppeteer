const path = require('path');
const puppeteer = require('puppeteer');

const outputPath = path.resolve(process.cwd(), 'output');

const NAV_SELECTOR = 'nav.navbar';
const NAV_NEW_COLOR = '#1F54C0';

/**
 * Opens the page, changes nav bar's `color` to #1F54C0, waits for results,
 * and saves the first page to pdf file.
 */
const runScript = async () => {
  let browser;
  try {
    // step start
    browser = await puppeteer.launch({
      headless: true,
    });

    // step 1
    const page = await browser.newPage();
    await page.goto('https://pptr.dev/', {
      waitUntil: 'networkidle2',
    });

    // step 2
    await page.waitForSelector(NAV_SELECTOR);

    // step 3
    await page.$eval(
      NAV_SELECTOR,
      (el, color) => {
        // eslint-disable-next-line no-param-reassign
        el.style.backgroundColor = color;
      },
      NAV_NEW_COLOR,
    );

    // step finish
    await page.screenshot({ path: path.join(outputPath, 'script2.png') });
  } catch (error) {
    console.error('Error has occurred in script2.', error);
  } finally {
    if (browser !== undefined) {
      await browser.close();
    }
  }
};

runScript();
