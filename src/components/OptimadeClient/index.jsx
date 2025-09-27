import { useState, useEffect, useCallback } from "react";
import { getProvidersList, getStructures } from "../../api";
import OptimadeHeader from "./OptimadeHeader";
import { DatabaseSelector } from "./DatabaseSelector";
import OptimadeFilters from "./OptimadeFilters";
import { ResultViewer } from "./ResultViewer";
import ResultsDropdown from "./ResultsDropdown";
import { ProviderInfo } from "./ProviderInfo";
import { PaginationHandler } from "./PaginationHandler";
import { AnimatePresence, motion } from "framer-motion";

export function OptimadeClient() {
  const [providers, setProviders] = useState([]);
  const [queryUrl, setQueryUrl] = useState("");
  const [currentFilter, setCurrentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentResult, setCurrentResult] = useState(null);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [metaData, setMetaData] = useState({
    data_returned: 0,
    data_available: 0,
  });

  // Load providers once
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const provObj = await getProvidersList(undefined, [
          "exmpl",
          "matcloud",
        ]);
        setProviders(provObj.data);
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    };
    loadProviders();
  }, []);

  // Fetch results whenever queryUrl, filter, or page changes
  const fetchResults = useCallback(async () => {
    if (!queryUrl) return;

    setLoading(true);
    try {
      const data = await getStructures({
        providerUrl: queryUrl,
        filter: currentFilter,
        page: currentPage,
      });
      setResults(data);

      const meta = data?.meta ?? { data_returned: 0, data_available: 0 };
      setMetaData(meta);
      setTotalPages(Math.max(1, Math.ceil((meta.data_returned ?? 0) / 20)));

      setCurrentResult(data?.data[0] || null);
    } catch (err) {
      console.error("Error fetching structures:", err);
      setCurrentResult(null);
    } finally {
      setLoading(false);
    }
  }, [queryUrl, currentFilter, currentPage]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <OptimadeHeader />

      <div className="flex flex-col items-center w-full max-w-3xl">
        {/* Database selector */}
        <div className="mt-4">
          <DatabaseSelector
            providers={providers}
            onQueryUrlChange={(url) => {
              // Only reset filter if provider actually changes
              if (url !== queryUrl) {
                setQueryUrl(url);
                setCurrentPage(1);
              }
            }}
          />
        </div>

        {/* Query URL display */}
        <div className="pt-2">
          Query Url:{" "}
          {queryUrl ? (
            <a
              href={queryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {queryUrl}
            </a>
          ) : (
            "None"
          )}
        </div>

        <div className="pb-4 px-0.5 w-full">
          <ProviderInfo queryUrl={queryUrl} />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {queryUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full p-4 border rounded bg-slate-50"
            >
              <OptimadeFilters
                onSubmit={(filter) => {
                  setCurrentFilter(filter);
                  setCurrentPage(1); // reset page when filter changes
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The results are only attempted to render if there is a valid query URL */}
        {queryUrl && (
          <div className="px-2 w-full">
            {/* Loading spinner haphazardly dumped in the middle of the section */}
            {loading && (
              <div className="flex justify-center items-center h-[800px]">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}

            <div className="border-b-2 pt-8"></div>

            {/* Implies zero results - either through server/syntax or filters too tight */}

            {!loading && !currentResult && currentFilter && (
              <div className="my-4 w-full rounded bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-3 text-sm">
                <strong className="font-semibold">Warning: </strong>
                No results returned for this query. The server may not be
                responsive Try to relax the filters, check the syntax of the
                query or the server may be unresponsive.
                <p className="text-xs text-center pt-2">
                  Attempted Query:{" "}
                  <a
                    href={`${queryUrl}/structures?filter=${encodeURIComponent(
                      currentFilter
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-700 hover:text-blue-900 break-all"
                  >
                    {`${queryUrl}/structures?filter=${currentFilter}`}
                  </a>
                </p>
              </div>
            )}

            {/* Implies success and */}
            {!loading && results && currentResult && (
              <div className="py-2 ">
                <ResultsDropdown
                  results={results}
                  resultsLoading={loading}
                  selectedResult={currentResult}
                  setSelectedResult={setCurrentResult}
                />

                <ResultViewer selectedResult={currentResult} />

                <PaginationHandler
                  currentPage={currentPage}
                  totalPages={totalPages}
                  resultsLoading={loading}
                  metaData={metaData}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
