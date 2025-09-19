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

  // Fetch sub-databases (children) when a provider is selected
  useEffect(() => {
    async function fetchLinks(baseUrl) {
      setLinksLoading(true);
      try {
        const res = await fetch(
          `https://cors-anywhere.herokuapp.com/${baseUrl}/v1/links`
        );
        if (!res.ok) throw new Error(`Failed to fetch links: ${res.status}`);
        const json = await res.json();

        const children = (json.data || []).filter(
          (d) => d.attributes?.link_type === "child"
        );

        if (children.length === 1) {
          setSelectedSub(children[0].attributes.base_url);
          setSubProviders([]);
          if (onSelectUrl) onSelectUrl(children[0].attributes.base_url);
        } else {
          setSubProviders(children);
          setSelectedSub("");
          if (onSelectUrl) onSelectUrl(baseUrl);
        }
      } catch (err) {
        console.error("Error fetching links:", err);
        setSubProviders([]);
        setSelectedSub("");
        if (onSelectUrl) onSelectUrl(baseUrl);
      } finally {
        setLinksLoading(false);
      }
    }

    if (selected && selected !== "__custom__") {
      fetchLinks(selected);
    } else {
      setSubProviders([]);
      setSelectedSub("");
      if (selected !== "__custom__") onSelectUrl(null);
    }
  }, [selected]);

  // Notify parent when sub-provider changes
  useEffect(() => {
    if (selectedSub && onSelectUrl) onSelectUrl(selectedSub);
  }, [selectedSub]);

  // Notify parent when custom endpoint changes
  useEffect(() => {
    if (customEndpoint && onSelectUrl) onSelectUrl(customEndpoint);
  }, [customEndpoint]);

  return (
    <div>
      <h1 className="text-2xl font-bold pb-2">Query a database</h1>

      <section className="flex flex-col pl-2 space-y-4">
        {loading && <p className="text-gray-500">Loading providers…</p>}
        {error && <p className="text-red-500">Failed to load providers</p>}

        {!loading && !error && (
          <>
            {/* Provider dropdown */}
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
              width={"w-[800px]"}
            />

            {/* Sub-provider dropdown if multiple */}
            {subProviders.length > 1 && (
              <DropdownWithSpinner
                options={subProviders.map((child) => ({
                  label: child.attributes.name || child.id,
                  value: child.attributes.base_url,
                }))}
                value={selectedSub}
                onChange={setSelectedSub}
                width={"w-[800px]"}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
