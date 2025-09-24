export async function getProvidersList(
  providersUrl = "https://raw.githubusercontent.com/Materials-Consortia/providers/refs/heads/master/src/links/v1/providers.json"
) {
  try {
    // Try fetching from the remote providers URL
    const response = await fetch(providersUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(
      "Remote fetch failed, falling back to cachedProviders.json:",
      err
    );

    // Fallback to local cachedProviders.json
    try {
      const cached = await fetch("cachedProviders.json");
      if (!cached.ok) {
        throw new Error(`Fallback fetch failed! status: ${cached.status}`);
      }
      return await cached.json();
    } catch (fallbackErr) {
      console.error("Both remote and local fetches failed:", fallbackErr);
      throw fallbackErr;
    }
  }
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
      // silent fallback, but could log in debug mode:
      // console.warn(`${name} fetch failed:`, err);
      continue;
    }
  }

  // Only runs if *all* attempts failed
  const err = new Error("All fetch methods failed");
  return { children: [], error: err };
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

  const url = `${providerUrl}/v1/structures${queryString}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch structures: ${res.status}`);

  const data = await res.json();
  return data;
}
