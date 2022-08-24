const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cronJob = require('node-cron');

const ps5 = 'https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p';
const test = 'https://www.bestbuy.com/site/sony-playstation-5-dualsense-wireless-controller-midnight-black/6464307.p';

async function initBrowser() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(test);
    return page;
}

async function checkStock(page) {
    await page.reload();
    let content = await page.evaluate(() => document.body.innerHTML);
    let $ = cheerio.load(content);

    $('.fulfillment-add-to-cart-button', content).each(function(){
        let oos = $(this).text().toLowerCase().includes("sold out");
        if(oos) {
            console.log("OUT OF STOCK");
        } else {
            console.log("IN STOCK");
        }
    });
}

async function monitor() {
    const page = await initBrowser();
    cronJob.schedule("*/15 * * * * *", function() {
        checkStock(page);
    });
}

monitor();