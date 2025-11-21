import { useState, useEffect } from "react";
import PTable from "./OptimadePTable";
import { QueryTextBox } from "./OptimadeRawQuery";
import RangeSlider from "../../common/RangeSlider";
import { buildQueryString } from "./OptimadeRawQuery/buildQueryString";

export default function OptimadeFilters({ initialFilter, onSubmit }) {
  // Parent can optionally pass an initial filter string
  const [numAtomsRange, setNumAtomsRange] = useState([1, 118]);
  const [numSitesRange, setNumSitesRange] = useState([1, 1000]);
  const [selectedElements, setSelectedElements] = useState({});

  const [manualMode, setManualMode] = useState(false);
  const [manualQuery, setManualQuery] = useState(initialFilter || "");

  // Regenerate query string based on ranges/elements
  const generatedQuery = buildQueryString(
    [1, 118],
    [1, 1000],
    selectedElements,
    numAtomsRange,
    numSitesRange
  );

  const filterString = manualMode ? manualQuery : generatedQuery;

  const handleSubmit = () => {
    onSubmit(filterString);
  };

  const toggleManualMode = () => {
    setManualMode((prev) => !prev);
    if (!manualMode) {
      setManualQuery(generatedQuery);
      setSelectedElements({});
      setNumAtomsRange([1, 118]);
      setNumSitesRange([1, 1000]);
    }
  };

  // Optional: sync initial filter from parent if it changes
  useEffect(() => {
    if (initialFilter) setManualQuery(initialFilter);
  }, [initialFilter]);

  return (
    <div className="space-y-2">
      <div className={manualMode ? "opacity-50 pointer-events-none" : ""}>
        <PTable
          selected={selectedElements}
          onSelectionChange={(el) =>
            setSelectedElements((prev) => ({ ...prev, ...el }))
          }
        />

        <RangeSlider
          title="Number of elements"
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

      <div className="pb-4 text-sm md:text-base">
        <QueryTextBox
          value={filterString}
          onChange={manualMode ? setManualQuery : () => {}}
          onSubmit={handleSubmit}
          placeholder="Enter OPTIMADE filter…"
        />
      </div>
    </div>
  );
}
