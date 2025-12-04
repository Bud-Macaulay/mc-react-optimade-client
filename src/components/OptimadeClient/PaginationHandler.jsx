import { FirstIcon, LastIcon, NextIcon, PreviousIcon } from "../common/Icons";

const buttonClassName =
  "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 hover:cursor-pointer disabled:bg-gray-200 disabled:opacity-50 disabled:cursor-default";

export function PaginationHandler({
  currentPage,
  totalPages,
  resultsLoading,
  metaData,
  onPageChange,
}) {
  if (!totalPages || totalPages < 1) return null;

  console.log("metaData", metaData);

  const dataReturned = metaData?.data_returned || "N/A";

  const hasPrev = currentPage > 1;
  const hasNext =
    metaData.more_data_available === true ||
    (typeof totalAvailable === "number" &&
      totalAvailable > currentPage * perPage);

  return (
    <div className="flex flex-wrap justify-center items-center gap-1">
      <span className="text-slate-700 text-sm text-center w-full md:w-auto">
        {`Filtered results: ${dataReturned} of ${metaData.data_available} | Showing page ${currentPage} of ${totalPages}`}
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
        disabled={!hasPrev || resultsLoading}
        className={buttonClassName}
      >
        <PreviousIcon />
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || resultsLoading}
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
