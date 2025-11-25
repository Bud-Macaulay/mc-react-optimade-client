const { chromium } = require("playwright");
const pixelmatch = require("pixelmatch").default || require("pixelmatch");
const { PNG } = require("pngjs");
const fs = require("fs");

const urls = [{ name: "home", path: "/" }];

async function run() {
  if (!fs.existsSync("diffs")) fs.mkdirSync("diffs");

  const browser = await chromium.launch();

  let mdOutput = "## Visual Diff Results\n\n";

  for (const { name, path } of urls) {
    const page = await browser.newPage();

    // PR screenshot
    await page.goto(`http://localhost:3001${path}`);
    const prPath = `diffs/${name}_pr.png`;
    await page.screenshot({ path: prPath, fullPage: true });

    // Base screenshot
    await page.goto(`http://localhost:3002${path}`);
    const basePath = `diffs/${name}_base.png`;
    await page.screenshot({ path: basePath, fullPage: true });

    // Compare
    const img1 = PNG.sync.read(fs.readFileSync(basePath));
    const img2 = PNG.sync.read(fs.readFileSync(prPath));
    const out = new PNG({ width: img1.width, height: img1.height });

    pixelmatch(img1.data, img2.data, out.data, img1.width, img1.height, {
      threshold: 0.3,
    });

    const diffPath = `diffs/${name}_diff.png`;
    fs.writeFileSync(diffPath, PNG.sync.write(out));

    // Encode diff as base64 for PR comment
    const base64 = fs.readFileSync(diffPath).toString("base64");
    mdOutput += `### ${name}\n![${name} diff](data:image/png;base64,${base64})\n\n`;

    await page.close();
  }

  await browser.close();

  // Output markdown to stdout for GitHub Action step
  console.log(mdOutput);
}

run();
