import { JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { StructureViewerWithDownload } from "../OptimadeStructureHandler";

export default function ResultDetails({ selectedResult }) {
  if (!selectedResult) return null;

  return (
    <div className="w-full flex flex-col space-y-4 items-center">
      <div className="w-full flex flex-col lg:flex-row gap-4">
        {/* Structure viewer */}
        <div className="w-full lg:w-1/2">
          <StructureViewerWithDownload OptimadeStructure={selectedResult} />
        </div>

        {/* JSON viewer */}
        <div className="w-full lg:w-1/2 bg-slate-100 rounded shadow border p-4 min-h-[12rem] h-[450px] overflow-auto text-xs">
          <JsonView
            data={selectedResult}
            compactTopLevel={true}
            shouldExpandNode={(level) => level < 2}
            style={{ backgroundColor: "" }}
          />
        </div>
      </div>
    </div>
  );
}
