import React, { useState, useEffect } from "react";
import { DropdownWithSpinner } from "../common/DropDownWIthSpinner";

export function OptimadeProviderDropdown({
  providers = [],
  loading,
  error,
  onSelectUrl,
}) {
  const [selected, setSelected] = useState("");
  const [subProviders, setSubProviders] = useState([]);
  const [selectedSub, setSelectedSub] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [linksLoading, setLinksLoading] = useState(false);

  useEffect(() => {
    async function fetchLinks(baseUrl) {
      setLinksLoading(true);
      try {
        const res = await fetch(
          `https://cors-anywhere.com/${baseUrl}/v1/links`
        );
        if (!res.ok) throw new Error(`Failed to fetch links: ${res.status}`);
        const json = await res.json();

        const children = (json.data || []).filter(
          (d) => d.attributes?.link_type === "child"
        );

        if (children.length === 1) {
          setSelectedSub(children[0].attributes.base_url);
          setSubProviders([]);
          onSelectUrl?.(children[0].attributes.base_url);
        } else {
          setSubProviders(children);
          setSelectedSub("");
          onSelectUrl?.(baseUrl);
        }
      } catch (err) {
        console.error("Error fetching links:", err);
        setSubProviders([]);
        setSelectedSub("");
        onSelectUrl?.(baseUrl);
      } finally {
        setLinksLoading(false);
      }
    }

    if (selected && selected !== "__custom__") {
      fetchLinks(selected);
    } else {
      setSubProviders([]);
      setSelectedSub("");
      if (selected !== "__custom__") onSelectUrl?.(null);
    }
  }, [selected]);

  useEffect(() => {
    if (selectedSub) onSelectUrl?.(selectedSub);
  }, [selectedSub]);

  useEffect(() => {
    if (customEndpoint) onSelectUrl?.(customEndpoint);
  }, [customEndpoint]);

  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      {/* Title */}
      <h1 className="text-2xl font-bold pb-4 text-center">Query a database</h1>

      <section className="flex flex-col space-y-4 w-full max-w-3xl">
        {loading && (
          <p className="text-gray-500 text-center">Loading providers…</p>
        )}
        {error && (
          <p className="text-red-500 text-center">Failed to load providers</p>
        )}

        {!loading && !error && (
          <>
            {/* Provider dropdown */}
            <div className="w-full">
              <DropdownWithSpinner
                options={providers
                  .filter((p) => p.attributes?.base_url)
                  .map((p) => ({
                    label: p.attributes.name || p.id,
                    value: p.attributes.base_url,
                  }))}
                value={selected}
                onChange={setSelected}
                loading={linksLoading}
                showCustomInput={true}
                customValue={customEndpoint}
                onCustomChange={setCustomEndpoint}
                width="w-full"
              />
            </div>

            {/* Sub-provider dropdown if multiple */}
            {subProviders.length > 1 && (
              <div className="w-full">
                <DropdownWithSpinner
                  options={subProviders.map((child) => ({
                    label: child.attributes.name || child.id,
                    value: child.attributes.base_url,
                  }))}
                  value={selectedSub}
                  onChange={setSelectedSub}
                  width="w-full"
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
