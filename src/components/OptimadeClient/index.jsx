import { useState, useEffect } from "react";
import { OptimadeProviderDropdown } from "../OptimadeProviderDropdown";
import { OptimadeFilters } from "../OptimadeFilters";

import StructureViewer from "../common/StructureViewer";

import { getProvidersList } from "../../api";

export function OptimadeClient() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProviderUrl, setSelectedProviderUrl] = useState(null);

  const [results, setResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const [currentFilter, setCurrentFilter] = useState("");

  const pageSize = 20;

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [metaData, setMetaData] = useState({});

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadProviders() {
      try {
        const provObj = await getProvidersList();
        setProviders(provObj.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, []);

  // Handle new results
  const handleResults = (data) => {
    setResults(data);
    setSelectedResult(data?.data?.[0] || null);

    const meta = data?.meta ?? {};
    setMetaData(meta);

    const total = meta.data_returned ?? 0;
    setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
  };
  {
    /* ensure first result is selected on load */
  }
  useEffect(() => {
    if (results?.data?.length > 0 && !selectedResult) {
      setSelectedResult(results.data[0]);
    }
  }, [results]);

  // Fetch specific page
  const fetchPage = async (pageNum) => {
    if (!selectedProviderUrl) return;

    setResultsLoading(true);
    try {
      const offset = (pageNum - 1) * pageSize;

      const query = currentFilter
        ? `?filter=${encodeURIComponent(currentFilter)}&page_offset=${offset}`
        : `?page_offset=${offset}`;

      const url = `${selectedProviderUrl}/v1/structures${query}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();

      handleResults(data);
      setCurrentPage(pageNum);
    } catch (err) {
      console.error("Error fetching page:", err);
    } finally {
      setResultsLoading(false);
    }
  };

  return (
    <div>
      {/* Logo */}
      <div className="flex items-start justify-start">
        <img
          src="/optimade_logo.png"
          alt="OptimadeLogo"
          className="h-32 w-auto object-contain"
        />
      </div>

      <div className="flex flex-col space-y-12">
        {/* Provider dropdown */}
        <div className="ml-4 mx-auto">
          <OptimadeProviderDropdown
            providers={providers}
            loading={loading}
            error={error}
            onSelectUrl={(url) => setSelectedProviderUrl(url)}
          />
        </div>

        {/* Filters */}
        <div className="ml-4 mx-auto">
          <OptimadeFilters
            providerUrl={selectedProviderUrl}
            onResults={handleResults}
            onFilterChange={setCurrentFilter}
          />
        </div>

        {/* Results dropdown */}
        <div className="ml-4 mx-auto w-72">
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
              className="w-full border-2 border-slate-300 bg-slate-200 py-2 px-3 rounded shadow hover:cursor-pointer hover:bg-slate-300"
              value={selectedResult?.id || (results?.data?.[0]?.id ?? "")}
              onChange={(e) => {
                const chosen = results.data.find(
                  (r) => r.id === e.target.value
                );
                if (chosen) setSelectedResult(chosen);
              }}
            >
              {results?.data?.map((result) => (
                <option key={result.id} value={result.id}>
                  {`${
                    result.attributes?.chemical_formula_descriptive || "Unknown"
                  } (${result.id})`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected result */}
        {selectedResult && (
          <div className="ml-4 mx-auto w-10/12">
            <h4 className="text-lg font-semibold mb-2">Selected Result</h4>
            <div className="p-4 bg-white rounded shadow border max-h-64 overflow-auto">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(selectedResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Structure viewer */}
        {selectedResult && (
          <div className="ml-4 mx-auto w-full h-96">
            <StructureViewer />
          </div>
        )}

        {/* Pagination */}
        {metaData.data_returned > 0 && (
          <div className="ml-4 mx-auto flex items-center space-x-2">
            <span className="text-gray-700">
              {`Filtered results: ${metaData.data_returned} of ${metaData.data_available} | Page ${currentPage} of ${totalPages}`}
            </span>

            <button
              onClick={() => fetchPage(1)}
              disabled={currentPage === 1 || resultsLoading}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ⏮ First
            </button>

            <button
              onClick={() => fetchPage(currentPage - 1)}
              disabled={currentPage === 1 || resultsLoading}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ◀ Prev
            </button>

            <button
              onClick={() => fetchPage(currentPage + 1)}
              disabled={currentPage === totalPages || resultsLoading}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next ▶
            </button>

            <button
              onClick={() => fetchPage(totalPages)}
              disabled={currentPage === totalPages || resultsLoading}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Last ⏭
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
