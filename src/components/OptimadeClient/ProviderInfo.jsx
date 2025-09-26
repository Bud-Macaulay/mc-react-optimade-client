import React, { useState, useEffect } from "react";
import { getInfo } from "../../api";

export function ProviderInfo({ queryUrl }) {
  const [urlInfo, setUrlInfo] = useState(null);
  const [urlInfoErrors, setUrlInfoErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryUrl) return;

    setLoading(true);
    setUrlInfo(null);
    setUrlInfoErrors([]);

    async function loadProviderInfo() {
      try {
        const { customProps, error } = await getInfo({ providerUrl: queryUrl });
        if (error) setUrlInfoErrors([error]);
        if (customProps) setUrlInfo(customProps);

        console.log("cP", customProps);
      } catch (err) {
        setUrlInfoErrors([err]);
      } finally {
        setLoading(false);
      }
    }

    loadProviderInfo();
  }, [queryUrl]);

  if (!queryUrl) return null;

  return (
    <div className="w-full mt-4">
      {loading && (
        <div className="flex items-center justify-center p-4 w-full bg-slate-50 border rounded">
          <div className="w-5 h-5 border-2 border-t-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mr-2"></div>
          <span className="text-gray-500">Loading provider info…</span>
        </div>
      )}

      {urlInfoErrors.length > 0 && !loading && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded mb-4 w-full">
          <strong>Failed to fetch provider info:</strong>
          <ul className="list-disc pl-5">
            {urlInfoErrors.map((err, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {urlInfo && !loading && (
        <div className="w-full py-2 px-4 border rounded bg-slate-50 max-h-72 overflow-auto">
          <h4 className="text-center font-semibold mb-2 text-xs sm:text-sm md:text-base">
            Custom attributes in selected database
          </h4>

          <div className="grid grid-cols-[8fr_17fr_2fr] gap-y-0.5 gap-x-2">
            <div className="font-semibold truncate text-[9px] sm:text-[11px] md:text-[13px]">
              Field
            </div>
            <div className="font-semibold text-[9px] sm:text-[11px] md:text-[13px]">
              Description
            </div>
            <div className="font-semibold truncate text-[9px] sm:text-[11px] md:text-[13px]">
              Unit
            </div>

            {Object.entries(urlInfo).map(([key, info]) => (
              <React.Fragment key={key}>
                <div className="break-words text-[9px] sm:text-[11px] md:text-[13px]">
                  {key}
                </div>
                <div className="break-words text-[9px] sm:text-[11px] md:text-[13px]">
                  {info.description || "-"}
                </div>
                <div className="break-words text-[9px] sm:text-[11px] md:text-[13px]">
                  {info.unit || "-"}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
