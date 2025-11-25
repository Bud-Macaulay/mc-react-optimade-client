const { chromium } = require("playwright");
const pixelmatch = require("pixelmatch").default || require("pixelmatch");
const { PNG } = require("pngjs");
const fs = require("fs");

const urls = [{ name: "home", path: "/" }];

async function run() {
  if (!fs.existsSync("diffs")) fs.mkdirSync("diffs");

  const browser = await chromium.launch();

  for (const { name, path } of urls) {
    const page = await browser.newPage();

    // PR screenshot
    await page.goto(`http://localhost:5173${path}`);
    await page.screenshot({ path: `diffs/${name}_pr.png`, fullPage: true });

    // Base screenshot
    await page.goto(`http://localhost:5173${path}`);
    await page.screenshot({ path: `diffs/${name}_base.png`, fullPage: true });

    // Compare
    const img1 = PNG.sync.read(fs.readFileSync(`diffs/${name}_base.png`));
    const img2 = PNG.sync.read(fs.readFileSync(`diffs/${name}_pr.png`));
    const out = new PNG({ width: img1.width, height: img1.height });

    pixelmatch(img1.data, img2.data, out.data, img1.width, img1.height, {
      threshold: 0.3,
    });

    fs.writeFileSync(`diffs/${name}_diff.png`, PNG.sync.write(out));

    await page.close();
  }

  await browser.close();
}

run();
