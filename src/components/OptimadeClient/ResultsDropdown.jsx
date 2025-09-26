import { slateDropdown } from "../../styles/dropdownStyles";

export default function ResultsDropdown({
  results,
  resultsLoading,
  selectedResult,
  setSelectedResult,
}) {
  return (
    <div className="w-full mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select a result
      </label>
      <select
        className={`${slateDropdown} w-full`}
        value={selectedResult?.id || ""}
        onChange={(e) => {
          const chosen = results?.data?.find((r) => r.id === e.target.value);
          if (chosen) setSelectedResult(chosen);
        }}
        disabled={resultsLoading || !results?.data?.length}
      >
        {!results?.data?.length ? (
          <option value="">No results for current query</option>
        ) : (
          results.data.map((result) => (
            <option key={result.id} value={result.id}>
              {`${
                result.attributes?.chemical_formula_descriptive || "Unknown"
              } (${result.id})`}
            </option>
          ))
        )}
      </select>

      {resultsLoading && (
        <div className="absolute right-5 top-1/2 bg-white bg-opacity-50 pointer-events-none">
          <div className="w-5 h-5 border-2 border-t-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
