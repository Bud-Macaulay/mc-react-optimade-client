import { slateDropdown } from "../../styles/dropdownStyles";

export default function ResultsDropdown({
  results,
  resultsLoading,
  selectedResult,
  setSelectedResult,
}) {
  return (
    <>
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
    </>
  );
}
