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
      const cached = await fetch("/cachedProviders.json");
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
