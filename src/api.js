export async function getProvidersList(
  providersUrl = "https://raw.githubusercontent.com/Materials-Consortia/providers/refs/heads/master/src/links/v1/providers.json",
  excludeIds = [] // array of provider IDs to remove
) {
  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
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

  // ---- Filter out providers in the excludeIds array ----
  const filteredData = json.data.filter(
    (provider) => !excludeIds.includes(provider.id)
  );

  return {
    ...json,
    data: filteredData,
  };
}

// currently the backend for this often has CORS disabled...
// We hack via using allorigins/cors anywhere.
// This will likely spit an error if the number of requests is very high
export async function getProviderLinks(baseUrl) {
  const extractChildren = (json) =>
    (json.data || []).filter((d) => d.attributes?.link_type === "child");

  const urls = [
    { name: "direct", url: `${baseUrl}/v1/links` },
    {
      name: "allorigins",
      url: `https://api.allorigins.win/raw?url=${encodeURIComponent(
        `${baseUrl}/v1/links`
      )}`,
    },
    {
      name: "cors-anywhere",
      url: `https://cors-anywhere.com/${baseUrl}/v1/links`,
    },
  ];

  for (const { url, name } of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        continue;
      }
      const json = await res.json();
      return { children: extractChildren(json), error: null };
    } catch (err) {
      continue;
    }
  }

  // Only runs if *all* attempts failed
  const err = new Error("All fetch methods failed");
  return { children: [], error: err };
}

export async function getInfo({ providerUrl }) {
  console.log(`${providerUrl}/v1/info`);
  const urls = [
    { name: "direct", url: `${providerUrl}/v1/info/structures` },
    {
      name: "allorigins",
      url: `https://api.allorigins.win/raw?url=${encodeURIComponent(
        `${providerUrl}/v1/info/structures`
      )}`,
    },
    {
      name: "cors-anywhere",
      url: `https://cors-anywhere.com/${providerUrl}/v1/info/structures`,
    },
  ];

  for (const { url, name } of urls) {
    console.log(url);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        continue;
      }
      const json = await res.json();

      const allProps = json.data.properties; // unused

      const filteredProps = Object.fromEntries(
        Object.entries(json.data.properties).filter(([key, value]) =>
          key.startsWith("_")
        )
      );

      console.log(filteredProps);

      return { customProps: filteredProps, error: null };
    } catch (err) {
      continue;
    }
  }
}

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

  const endpoints = [
    `${providerUrl}/v1/structures${queryString}`, // direct
    `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `${providerUrl}/v1/structures${queryString}`
    )}`,
    `https://cors-anywhere.com/${providerUrl}/v1/structures${queryString}`,
  ];

  for (const url of endpoints) {
    try {
      console.log("URL", url);
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      return data;
    } catch {
      // silent fallback
      continue;
    }
  }

  // If all fetch attempts fail
  throw new Error("All fetch methods failed for getStructures");
}
