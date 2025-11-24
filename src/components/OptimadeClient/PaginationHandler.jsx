import { FirstIcon, LastIcon, NextIcon, PreviousIcon } from "../common/Icons";

export function PaginationHandler({
  currentPage,
  totalPages,
  resultsLoading,
  metaData,
  onPageChange,
}) {
  if (!totalPages || totalPages < 1) return null;

  const buttonClassName =
    "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-default";

  return (
    <div className="flex flex-wrap justify-center items-center gap-1">
      <span className="text-slate-700 text-sm text-center w-full md:w-auto">
        {`Filtered results: ${metaData.data_returned} of ${metaData.data_available} | Showing page ${currentPage} of ${totalPages}`}
      </span>

      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || resultsLoading}
        className={buttonClassName}
      >
        <FirstIcon />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || resultsLoading}
        className={buttonClassName}
      >
        <PreviousIcon />
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || resultsLoading}
        className={buttonClassName}
      >
        <NextIcon />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || resultsLoading}
        className={buttonClassName}
      >
        <LastIcon />
      </button>
    </div>
  );
}
