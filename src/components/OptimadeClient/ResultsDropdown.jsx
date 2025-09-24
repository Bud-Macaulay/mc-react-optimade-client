export default function ResultsDropdown({
  results,
  resultsLoading,
  selectedResult,
  setSelectedResult,
  slateDropdown,
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select a result
      </label>

      {resultsLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-t-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-500">Loading results…</span>
        </div>
      ) : (
        <select
          className={`${slateDropdown} mb-4`}
          value={selectedResult?.id || ""}
          onChange={(e) => {
            const chosen = results?.data?.find((r) => r.id === e.target.value);
            if (chosen) setSelectedResult(chosen);
          }}
          disabled={!results?.data || results?.data.length === 0}
        >
          {!results?.data || results.data.length === 0 ? (
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
      )}
    </div>
  );
}
