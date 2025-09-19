import { useState, useEffect } from "react";
import { OptimadeProviderDropdown } from "../OptimadeProviderDropdown";
import { OptimadeFilters } from "../OptimadeFilters";
import { OptimadeResultsDropdown } from "../OptimadeResultsDropDown";
import { getProvidersList } from "../../api";

export function OptimadeClient() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProviderUrl, setSelectedProviderUrl] = useState(null);

  const [results, setResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

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
    console.log(data);
    setSelectedResult(data?.data?.[0] || null);

    // update pagination info
    setMetaData(data?.meta ?? {});

    setTotalPages(Math.ceil(metaData.data_returned / 20));
  };

  // Fetch specific page
  const fetchPage = async (pageNum) => {
    if (!selectedProviderUrl) return;

    setResultsLoading(true);
    try {
      const offset = (pageNum - 1) * pageSize;
      const url = `${selectedProviderUrl}/v1/structures?page_offset=${offset}`;

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
          />
        </div>

        {/* Results dropdown */}
        <div className="ml-4 mx-auto">
          <OptimadeResultsDropdown
            results={results}
            loading={resultsLoading}
            selectedResult={selectedResult}
            onSelect={setSelectedResult}
          />
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
