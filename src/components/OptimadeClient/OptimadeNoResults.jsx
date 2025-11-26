import { warningContainerStyle } from "../../styles/containerStyles";
import { textSmall, textHyperlink } from "../../styles/textStyles";

export default function OptimadeNoResults({ queryUrl, currentFilter }) {
  const encodedUrl = `${queryUrl}/structures?filter=${encodeURIComponent(
    currentFilter
  )}`;

  // decode for display only
  const readableUrl = `${queryUrl}/structures?filter=${decodeURIComponent(
    currentFilter
  )}`;

  return (
    <div className={`${warningContainerStyle} ${textSmall}`}>
      <strong className="font-semibold">Warning: </strong>
      No results returned for this query. The server may not be responsive or
      try to relax the filters.
      <p className="pt-2">
        Attempted Query:{" "}
        <a
          href={encodedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${textHyperlink} break-all`}
        >
          {readableUrl}
        </a>
      </p>
    </div>
  );
}
