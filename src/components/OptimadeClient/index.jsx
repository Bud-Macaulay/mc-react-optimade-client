import { useState, useEffect } from "react";
import { OptimadeProviderDropdown } from "../OptimadeProviderDropdown";
import { OptimadeFilters } from "../OptimadeFilters";

import { slateDropdown } from "../../styles/dropdownStyles";

import { JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import { StructureViewerWithDownload } from "../OptimadeStructureHandler";

import { getProvidersList, getStructures } from "../../api";

import { FirstIcon, LastIcon, NextIcon, PreviousIcon } from "../common/Icons";

export function OptimadeClient() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProviderUrl, setSelectedProviderUrl] = useState(null);

  const [lastQuery, setLastQuery] = useState("");
  const [lastProviderUrl, setLastProviderUrl] = useState(null);

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
  const handleResults = (
    data,
    query = currentFilter,
    url = selectedProviderUrl
  ) => {
    setResults(data);
    setSelectedResult(data?.data?.[0] || null);

    const meta = data?.meta ?? {};
    setMetaData(meta);

    const total = meta.data_returned ?? 0;
    setTotalPages(Math.max(1, Math.ceil(total / pageSize)));

    // Update last executed query and URL
    setLastQuery(query);
    setLastProviderUrl(url);
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
      const data = await getStructures({
        providerUrl: selectedProviderUrl,
        filter: currentFilter,
        page: pageNum,
        pageSize,
      });

      handleResults(data, currentFilter, selectedProviderUrl);
      setCurrentPage(pageNum);
    } catch (err) {
      console.error("Error fetching page:", err);
    } finally {
      setResultsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Logo at the top */}
      <div className="flex justify-center py-4 bg-white shadow w-full">
        <img
          src="/optimade_logo.png"
          alt="OptimadeLogo"
          className="h-24 sm:h-32 w-auto object-contain"
        />
      </div>

      {/* Main content area: single column */}
      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Provider dropdown */}
        <div className="w-full">
          <OptimadeProviderDropdown
            providers={providers}
            loading={loading}
            error={error}
            onSelectUrl={(url) => setSelectedProviderUrl(url)}
          />
        </div>

        {/* Filters */}
        <div className="w-full pt-8">
          <OptimadeFilters
            providerUrl={selectedProviderUrl}
            onResults={handleResults}
            onFilterChange={setCurrentFilter}
          />
        </div>

        <div className="border-t-2 pt-4 w-full text-center text-2xl">
          Query Results
        </div>

        <div className="w-full text-center text-sm text-gray-600 mt-2">
          <div>
            <strong>Last Query:</strong> {lastQuery || "None"}
          </div>
          <div>
            <strong>Last Provider URL:</strong>{" "}
            {lastProviderUrl || "None selected"}
          </div>
        </div>

        {/* Pagination TODO - sometimes data_returned is null and this whole block does not render
        Should try and handle by in those cases keeping the forward backward button eitherway?
        */}
        {metaData.data_returned > 0 && (
          <div className="pt-8">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <span className="text-gray-700 text-sm text-center w-full md:w-auto">
                {`Filtered results: ${metaData.data_returned} of ${metaData.data_available} | Page ${currentPage} of ${totalPages}`}
              </span>

              <button
                onClick={() => fetchPage(1)}
                disabled={currentPage === 1 || resultsLoading}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-default"
              >
                <FirstIcon />
              </button>

              <button
                onClick={() => fetchPage(currentPage - 1)}
                disabled={currentPage === 1 || resultsLoading}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-default"
              >
                <PreviousIcon />
              </button>

              <button
                onClick={() => fetchPage(currentPage + 1)}
                disabled={currentPage === totalPages || resultsLoading}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-default"
              >
                <NextIcon />
              </button>

              <button
                onClick={() => fetchPage(totalPages)}
                disabled={currentPage === totalPages || resultsLoading}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-default"
              >
                <LastIcon />
              </button>
            </div>
          </div>
        )}

        {/* Results dropdown */}
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
                const chosen = results?.data?.find(
                  (r) => r.id === e.target.value
                );
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
                      result.attributes?.chemical_formula_descriptive ||
                      "Unknown"
                    } (${result.id})`}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {/* Selected result JSON */}
        {selectedResult && (
          <div className="w-full flex flex-col space-y-4 items-center">
            <div className="bg-slate-100 rounded shadow border p-4 w-full min-h-[12rem] max-h-96 overflow-auto text-xs">
              <h4 className="text-lg mb-2">OPTIMADE API Response</h4>
              <JsonView
                data={selectedResult}
                compactTopLevel={true}
                shouldExpandNode={(level) => level < 2}
                style={{ backgroundColor: "" }} // overide bg color to match parent div.
              />
            </div>

            {/* Structure viewer */}
            <div className="w-full pb-8">
              <StructureViewerWithDownload OptimadeStructure={selectedResult} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
