import { FirstIcon, LastIcon, NextIcon, PreviousIcon } from "../common/Icons";

export function PaginationHandler({
  currentPage,
  totalPages,
  resultsLoading,
  metaData,
  onPageChange,
}) {
  if (!totalPages || totalPages < 1) return null;

  return (
    <div className="flex flex-wrap justify-center items-center gap-1 mt-4">
      <span className="text-gray-700 text-sm text-center w-full md:w-auto">
        {`Filtered results: ${metaData.data_returned} of ${metaData.data_available} | Page ${currentPage} of ${totalPages}`}
      </span>

      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || resultsLoading}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-default"
      >
        <FirstIcon />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || resultsLoading}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-default"
      >
        <PreviousIcon />
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || resultsLoading}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-default"
      >
        <NextIcon />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || resultsLoading}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-default"
      >
        <LastIcon />
      </button>
    </div>
  );
}
