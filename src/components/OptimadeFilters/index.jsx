import { useState } from "react";

import PTable from "./OptimadePTable";
import { QueryTextBox } from "./OptimadeRawQuery";
import RangeSlider from "../common/RangeSlider";
import { buildQueryString } from "./OptimadeRawQuery/buildQueryString";

export function OptimadeFilters({ providerUrl, onResults }) {
  const [numAtomsRange, setNumAtomsRange] = useState([1, 118]);
  const [numSitesRange, setNumSitesRange] = useState([1, 1000]);
  const [selectedElements, setSelectedElements] = useState({});
  const [loading, setLoading] = useState(false);

  const filterString = buildQueryString(
    [1, 118],
    [1, 1000],
    selectedElements,
    numAtomsRange,
    numSitesRange
  );

  const handleSubmit = async () => {
    if (!providerUrl) return alert("Please select a provider first!");

    setLoading(true);
    try {
      const query = filterString
        ? `?filter=${encodeURIComponent(filterString)}`
        : "";
      const url = `${providerUrl}/v1/structures${query}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();

      onResults?.(data); // ✅ send parsed results up
    } catch (err) {
      console.error("Error fetching structures:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <QueryTextBox
        value={filterString}
        onChange={() => {}}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <PTable
        selected={selectedElements}
        onSelectionChange={(el) =>
          setSelectedElements((prev) => ({ ...prev, ...el }))
        }
      />

      <RangeSlider
        title="Number of atoms"
        value={numAtomsRange}
        onChange={setNumAtomsRange}
        min={1}
        max={118}
      />

      <RangeSlider
        title="Number of sites"
        value={numSitesRange}
        onChange={setNumSitesRange}
        min={0}
        max={1000}
      />
    </div>
  );
}
