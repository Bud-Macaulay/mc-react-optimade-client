import { FirstIcon, LastIcon, NextIcon, PreviousIcon } from "../common/Icons";

export default function PaginationControls({
  currentPage,
  totalPages,
  metaData,
  resultsLoading,
  fetchPage,
}) {
  if (metaData.data_returned <= 0) return null;

  return (
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
  );
}
