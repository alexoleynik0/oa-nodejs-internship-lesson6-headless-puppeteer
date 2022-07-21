const path = require('path');
const puppeteer = require('puppeteer');

const outputPath = path.resolve(__dirname, '..', 'output');

const SEARCH_INPUT_SELECTOR = '.navbar__search input[aria-label="Search"]';
const SEARCH_RESULTS_SELECTOR = '.navbar__search span[class*=dropdownMenu_]';

/**
 * Opens the page, inputs 'pdf' in the nav's search input, waits for results to be shown,
 * and saves page as pdf file (first page only).
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
    await page.waitForSelector(SEARCH_INPUT_SELECTOR);
    await page.type(SEARCH_INPUT_SELECTOR, 'pdf');

    // step 3
    await page.waitForSelector(SEARCH_RESULTS_SELECTOR);

    // step 4
    await page.addStyleTag({
      content: `
        @media print {
          .navbar {
            display: flex;
          }
        }
      `,
    });

    // step finish
    await page.pdf({
      format: 'a4',
      pageRanges: '1',
      path: path.join(outputPath, 'script1.pdf'),
    });
  } catch (error) {
    console.error('Error has occurred in script1.', error);
  } finally {
    if (browser !== undefined) {
      await browser.close();
    }
  }
};

runScript();
