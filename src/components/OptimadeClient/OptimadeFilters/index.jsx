import { useState, useEffect } from "react";
import PTable from "./OptimadePTable";
import { QueryTextBox } from "./OptimadeRawQuery";
import RangeSlider from "../../common/RangeSlider";
import { buildQueryString } from "./OptimadeRawQuery/buildQueryString";

export default function OptimadeFilters({
  providerUrl,
  onResults,
  onFilterChange,
}) {
  const [numAtomsRange, setNumAtomsRange] = useState([1, 118]);
  const [numSitesRange, setNumSitesRange] = useState([1, 1000]);
  const [selectedElements, setSelectedElements] = useState({});
  const [loading, setLoading] = useState(false);

  const [manualMode, setManualMode] = useState(false);
  const [manualQuery, setManualQuery] = useState("");

  // If not in manual mode, build the query automatically
  const generatedQuery = buildQueryString(
    [1, 118],
    [1, 1000],
    selectedElements,
    numAtomsRange,
    numSitesRange
  );

  // The active query is either manual or generated
  const filterString = manualMode ? manualQuery : generatedQuery;

  useEffect(() => {
    onFilterChange?.(filterString);
  }, [filterString]);

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

      onResults?.(data);
    } catch (err) {
      console.error("Error fetching structures:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleManualMode = () => {
    setManualMode((prev) => !prev);

    if (!manualMode) {
      // entering manual mode
      setManualQuery(generatedQuery);
      setSelectedElements({});
      setNumAtomsRange([1, 118]);
      setNumSitesRange([1, 1000]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Guided filters */}
      <div className={manualMode ? "opacity-50 pointer-events-none" : ""}>
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

      {/* Unlock query checkbox */}
      <div className="flex items-center space-x-2">
        <input
          id="manual-mode-toggle"
          type="checkbox"
          checked={manualMode}
          onChange={toggleManualMode}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label
          htmlFor="manual-mode-toggle"
          className="text-sm text-gray-700 select-none"
        >
          Unlock custom query
        </label>
      </div>

      {/* Query box */}
      <div className="pb-4">
        <QueryTextBox
          value={filterString}
          onChange={manualMode ? setManualQuery : () => {}}
          onSubmit={handleSubmit}
          loading={loading}
          placeholder="Enter OPTIMADE filter…"
        />
      </div>
    </div>
  );
}
