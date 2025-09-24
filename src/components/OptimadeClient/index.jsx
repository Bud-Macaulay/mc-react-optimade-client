import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { slateDropdown } from "../../styles/dropdownStyles";

import { getProvidersList, getStructures } from "../../api";

import OptimadeHeader from "./OptimadeHeader";
import OptimadeFAQs from "./OptimadeFAQs"; // unused.
import OptimadeProviderDropdown from "./OptimadeProviderDropdown";
import OptimadeFilters from "./OptimadeFilters";
import QuerySummary from "./QuerySummary";
import PaginationControls from "./PaginationControls";
import ResultsDropdown from "./ResultsDropdown";
import ResultDetails from "./ResultsDetails";

/* Parent Component for the Optimade Client*/
export function OptimadeClient() {
  /** ─── Provider state ─────────────────────────── */
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true); // providers loading
  const [error, setError] = useState(null);
  const [selectedProviderUrl, setSelectedProviderUrl] = useState(null);

  /** ─── Query + results state ──────────────────── */
  const [currentFilter, setCurrentFilter] = useState("");
  const [lastQuery, setLastQuery] = useState(""); // last submitted filter
  const [lastProviderUrl, setLastProviderUrl] = useState(null); // last submitted provider
  const [results, setResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  /** ─── Pagination state ───────────────────────── */
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [metaData, setMetaData] = useState({
    data_returned: 0,
    data_available: 0,
  });

  const [totalPages, setTotalPages] = useState(1);

  /** ─── Effects ────────────────────────────────── */
  // Fetch providers list once at mount
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

  // Ensure first result is selected whenever new results arrive
  useEffect(() => {
    if (results?.data?.length > 0 && !selectedResult) {
      setSelectedResult(results.data[0]);
    }
  }, [results]);

  // Reset to first page when provider or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProviderUrl, currentFilter]);

  /** ─── Handlers ───────────────────────────────── */
  // Update results + metadata after fetch
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

    // Record last successful query + provider
    setLastQuery(query);
    setLastProviderUrl(url);
  };

  // Fetch specific page of results
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

  /** ─── Render ─────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Logo at the top */}
      <OptimadeHeader />

      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Provider dropdown */}
        <OptimadeProviderDropdown
          providers={providers}
          loading={loading}
          error={error}
          onSelectUrl={(url) => setSelectedProviderUrl(url)}
        />

        <AnimatePresence>
          {selectedProviderUrl && (
            <motion.div
              key="results-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full pb-4"
            >
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

              <QuerySummary
                lastQuery={lastQuery}
                lastProviderUrl={lastProviderUrl}
              />

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                metaData={metaData}
                resultsLoading={resultsLoading}
                fetchPage={fetchPage}
              />

              <ResultsDropdown
                results={results}
                resultsLoading={resultsLoading}
                selectedResult={selectedResult}
                setSelectedResult={setSelectedResult}
                slateDropdown={slateDropdown}
              />

              <ResultDetails selectedResult={selectedResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
