// ResultsViewer.js
import { useMemo } from "react";
import { JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { StructureViewerWithDownload } from "../OptimadeStructureHandler";
import QEInputButton from "../common/QEInputButton";
import { slateDropdown } from "../../styles/dropdownStyles";

import { generateCIFfromMatrix } from "../../utils";

export function ResultViewer({ selectedResult }) {
  const lattice = selectedResult?.attributes?.lattice_vectors ?? [];
  const sitesRaw = selectedResult?.attributes?.cartesian_site_positions ?? [];
  const species = selectedResult?.attributes?.species_at_sites ?? [];

  const sites = sitesRaw.map((pos, i) => ({
    element: species[i],
    x: pos[0],
    y: pos[1],
    z: pos[2],
  }));

  const structureData = useMemo(() => ({ lattice, sites }), [lattice, sites]);
  const cifText = useMemo(
    () => generateCIFfromMatrix(structureData),
    [structureData]
  );

  return (
    <div className="w-full mt-2 md:mt-4 flex flex-col">
      {/* Result details */}
      {selectedResult && (
        <div className="@container w-full flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="w-full md:w-1/2">
            <StructureViewerWithDownload
              OptimadeStructure={selectedResult}
              cifText={cifText}
            />
          </div>
          <div className="w-full md:w-1/2 bg-slate-100 rounded shadow border p-2 min-h-48 md:h-[450px] h-[200px] overflow-auto text-xs">
            <p className="text-sm md:text-md pb-1 md:pb-2">
              OPTIMADE JSON RESPONSE
            </p>
            <JsonView
              data={selectedResult}
              compactTopLevel
              shouldExpandNode={(level) => level < 2}
              style={{ backgroundColor: "" }}
            />
          </div>
        </div>
      )}

      <div className="mt-2 md:mt-4 flex justify-center">
        <QEInputButton cifText={cifText} />
      </div>
    </div>
  );
}
