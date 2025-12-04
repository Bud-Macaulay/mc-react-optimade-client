// build-counts-cache.mjs
import fs from "fs";
import path from "path";
import {
  getProvidersList,
  getProviderLinks,
  getElementsCount,
} from "../src/api.js";

const OUTPUT_PATH = path.resolve("./public/cachedElementCounts.json");

// load old cache if available
function loadCache() {
  if (!fs.existsSync(OUTPUT_PATH)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    return Object.fromEntries(data.map((e) => [e.providerUrl, e]));
  } catch (err) {
    console.warn("Failed to parse existing cache:", err);
    return {};
  }
}

function saveCache(map) {
  const arr = Object.values(map);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(arr, null, 2));
}

async function processProvider(provider, cacheMap) {
  const baseUrl = provider.attributes.base_url;
  if (!baseUrl || !baseUrl.startsWith("http")) {
    console.log(`Skipping provider ${provider} (invalid base_url):`, baseUrl);
    return;
  }

  console.log(`\n→ Provider: ${baseUrl}`);

  let links;
  try {
    links = await getProviderLinks(baseUrl);
  } catch (err) {
    console.log(`  Failed to fetch provider links:`, err.message);
    return;
  }

  if (links.error) {
    console.log(`  Provider returned error`);
    return;
  }

  console.log(`  Children: ${links.children.length}`);

  for (const child of links.children) {
    const url = child.attributes.base_url;
    if (!url || !url.startsWith("http")) {
      console.log(`    Skipping child (invalid URL):`, url);
      continue;
    }

    console.log(`    → Child: ${url}`);

    // Check for cache hit
    if (cacheMap[url]?.min != null && cacheMap[url]?.max != null) {
      console.log(
        `      Cached ✓ (min=${cacheMap[url].min}, max=${cacheMap[url].max})`
      );
      continue;
    }

    console.log(`      Fetching element counts...`);

    const { min, max, durationMs } = await getElementsCount({
      providerUrl: url,
    });

    console.log(
      `      Result: min=${min}, max=${max} fetchTime=${durationMs.toFixed(
        0
      )}ms`
    );

    cacheMap[url] = { providerUrl: url, min, max };
    saveCache(cacheMap);
  }
}

async function main() {
  const prevCache = loadCache();
  const cacheMap = { ...prevCache };

  console.log("Loading providers list...");

  const { data: providers } = await getProvidersList();

  console.log(`Total providers: ${providers.length}`);

  for (const provider of providers) {
    await processProvider(provider, cacheMap);
  }

  saveCache(cacheMap);
  console.log("\nDone. Cached element ranges written to", OUTPUT_PATH);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
