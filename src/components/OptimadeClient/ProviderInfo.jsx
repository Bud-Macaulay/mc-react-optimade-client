import React, { useState, useEffect, useRef } from "react";
import { getInfo } from "../../api";

export function ProviderInfo({ queryUrl }) {
  const [urlInfo, setUrlInfo] = useState(null);
  const [urlInfoErrors, setUrlInfoErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

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
      } catch (err) {
        setUrlInfoErrors([err]);
      } finally {
        setLoading(false);
      }
    }

    loadProviderInfo();
  }, [queryUrl]);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, urlInfo, urlInfoErrors, loading]);

  if (!queryUrl) return null;

  return (
    <div className="w-full mt-4 border rounded bg-slate-50 shadow-sm overflow-hidden">
      {/* Accordion Header + Container */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 bg-slate-100 hover:bg-slate-200 transition"
      >
        <span className="text-sm font-semibold">
          Custom attributes in selected database
        </span>
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="p-4">
          {loading && (
            <div className="flex items-center justify-center">
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
          )}
        </div>
      </div>
    </div>
  );
}
