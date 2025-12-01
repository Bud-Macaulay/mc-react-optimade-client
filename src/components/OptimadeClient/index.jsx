import { useState, useEffect, useCallback } from "react";
import { getProvidersList, getStructures } from "../../api";
import OptimadeHeader from "./OptimadeHeader";
import { DatabaseSelector } from "./DatabaseSelector";
import OptimadeFilters from "./OptimadeFilters";
import OptimadeFAQs from "./OptimadeFAQs";
import { ResultViewer } from "./ResultViewer";
import ResultsDropdown from "./ResultsDropdown";
import OptimadeProviderInfo from "./OptimadeProviderInfo";
import { PaginationHandler } from "./PaginationHandler";
import { AnimatePresence, motion } from "framer-motion";

import OptimadeNoResults from "./OptimadeNoResults";

import MaterialsCloudHeader from "mc-react-header";
import OptimadeChildInfo from "./OptimadeChildInfo";
import OptimadeParentInfo from "./OptimadeParentInfo";

import { textHyperlink, textNormal, textSmall } from "../../styles/textStyles";
import { containerStyle } from "../../styles/containerStyles";

export function OptimadeClient({ hideProviderList = ["exmpl", "matcloud"] }) {
  const [providers, setProviders] = useState([]);
  const [queryUrl, setQueryUrl] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

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
        const provObj = await getProvidersList(undefined, hideProviderList);
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
    <>
      <MaterialsCloudHeader
        className="header"
        activeSection={"work"}
        breadcrumbsPath={[
          {
            name: "Work",
            link: "https://www.materialscloud.org/work",
          },
          {
            name: "OPTIMADE-Client",
            link: null,
          },
        ]}
      />
      {/* make the inner container */}
      <div className="min-h-screen max-w-5xl mx-auto bg-white mb-4 shadow-md rounded-xs">
        <div className="flex flex-col items-center w-full px-2 py-2">
          <OptimadeHeader />

          <div className="p-2 w-full">
            <OptimadeFAQs />
          </div>
          {/* Database selector */}
          <div className="pt-4 p-2">
            <DatabaseSelector
              providers={providers}
              onChildChange={setSelectedChild}
              onProviderChange={setSelectedProvider}
              onQueryUrlChange={(url) => {
                // Only reset filter if provider actually changes
                if (url !== queryUrl) {
                  setQueryUrl(url);
                  setCurrentPage(1);
                }
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row w-full max-w-5xl px-4 py-2 gap-4">
            <div className="md:w-1/2 w-full">
              <OptimadeParentInfo
                provider={selectedProvider}
                providers={providers}
              />
            </div>

            <div className="md:w-1/2 w-full">
              <OptimadeChildInfo child={selectedChild} />
            </div>
          </div>

          {/* Filters */}
          <div className="p-2 w-full">
            <AnimatePresence>
              {queryUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={containerStyle}
                >
                  <OptimadeFilters
                    queryUrl={queryUrl}
                    onSubmit={(filter) => {
                      setCurrentFilter(filter);
                      setCurrentPage(1); // reset page when filter changes
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-2 w-full">
            <OptimadeProviderInfo queryUrl={queryUrl} />
          </div>

          {/* The results are only attempted to render if there is a valid query URL */}
          {queryUrl && (
            <div className="px-2 w-full">
              {/* Loading spinner haphazardly dumped in the middle of the section */}
              {loading && (
                <div className="flex justify-center items-center h-[610px]">
                  <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}

              <div className="border-b border-slate-300 py-2"></div>

              {/* zero results - either through server/syntax or filters too tight */}
              {!loading && !currentResult && currentFilter && (
                <div className="p-2">
                  <OptimadeNoResults
                    queryUrl={queryUrl}
                    currentFilter={currentFilter}
                  />
                </div>
              )}

              {/* Implies success  */}
              {!loading && results && currentResult && (
                <div className="py-1 md:py-2 ">
                  <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
                    <div className="flex-1">
                      <ResultsDropdown
                        results={results}
                        resultsLoading={loading}
                        selectedResult={currentResult}
                        setSelectedResult={setCurrentResult}
                      />
                    </div>
                    <div>
                      <PaginationHandler
                        currentPage={currentPage}
                        totalPages={totalPages}
                        resultsLoading={loading}
                        metaData={metaData}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </div>

                  <div className="py-4">
                    <ResultViewer selectedResult={currentResult} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
