import { corsProxies } from "./corsProxies";

// --- Providers list ---
export async function getProvidersList(
  providersUrl = "https://raw.githubusercontent.com/Materials-Consortia/providers/refs/heads/master/src/links/v1/providers.json",
  excludeIds = []
) {
  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  }

  let json;
  try {
    json = await fetchJson(providersUrl);
  } catch (err) {
    console.warn(
      "Remote fetch failed, falling back to cachedProviders.json:",
      err
    );
    try {
      json = await fetchJson("cachedProviders.json");
    } catch (fallbackErr) {
      console.error("Both remote and local fetches failed:", fallbackErr);
      throw fallbackErr;
    }
  }

  const filteredData = json.data.filter((p) => !excludeIds.includes(p.id));
  return { ...json, data: filteredData };
}

// --- Provider links ---
export async function getProviderLinks(baseUrl) {
  const extractChildren = (json) =>
    (json.data || []).filter((d) => d.attributes?.link_type === "child");

  const attempts = [
    { name: "direct", url: `${baseUrl}/v1/links` },
    ...corsProxies.map((proxy) => ({
      name: proxy.name,
      url: proxy.urlRule(`${baseUrl}/v1/links`),
    })),
  ];

  for (const { url, name } of attempts) {
    try {
      console.log(`Trying ${name}: ${url}`);
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      return { children: extractChildren(json), error: null };
    } catch {
      continue;
    }
  }

  return { children: [], error: new Error("All fetch attempts failed") };
}

// --- Provider info ---
export async function getInfo({ providerUrl }) {
  const attempts = [
    { name: "direct", url: `${providerUrl}/v1/info/structures` },
    ...corsProxies.map((proxy) => ({
      name: proxy.name,
      url: proxy.urlRule(`${providerUrl}/v1/info/structures`),
    })),
  ];

  for (const { url, name } of attempts) {
    try {
      console.log(`Trying ${name}: ${url}`);
      const res = await fetch(url);
      if (!res.ok) continue;

      const json = await res.json();
      const filteredProps = Object.fromEntries(
        Object.entries(json.data.properties || {}).filter(([key]) =>
          key.startsWith("_")
        )
      );

      return { customProps: filteredProps, error: null };
    } catch {
      continue;
    }
  }

  return { customProps: {}, error: new Error("All fetch attempts failed") };
}

// --- Provider structures ---
export async function getStructures({
  providerUrl,
  filter = "",
  page = 1,
  pageSize = 20,
}) {
  if (!providerUrl) throw new Error("Provider URL is required");

  const offset = (page - 1) * pageSize;
  const queryString = filter
    ? `?filter=${encodeURIComponent(filter)}&page_offset=${offset}`
    : `?page_offset=${offset}`;

  const attempts = [
    { name: "direct", url: `${providerUrl}/v1/structures${queryString}` },
    ...corsProxies.map((proxy) => ({
      name: proxy.name,
      url: proxy.urlRule(`${providerUrl}/v1/structures${queryString}`),
    })),
  ];

  for (const { url, name } of attempts) {
    try {
      console.log(`Trying ${name}: ${url}`);
      const res = await fetch(url);
      if (!res.ok) continue;
      return await res.json();
    } catch {
      continue;
    }
  }

  throw new Error("All fetch attempts failed for getStructures");
}
