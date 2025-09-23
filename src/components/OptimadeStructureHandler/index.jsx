import { useMemo } from "react";
import StructureVisualizer from "mc-react-structure-visualizer";
import { StructureDownload } from "../common/StructureDownload";
import { generateCIFfromMatrix } from "../../utils";

import QEInputButton from "../QEInputButton";

export function StructureViewerWithDownload({
  OptimadeStructure,
  className = "",
}) {
  const lattice = OptimadeStructure.attributes.lattice_vectors;
  const sitesRaw = OptimadeStructure.attributes.cartesian_site_positions;
  const species = OptimadeStructure.attributes.species_at_sites;

  const sites = sitesRaw.map((pos, i) => ({
    element: species[i],
    x: pos[0],
    y: pos[1],
    z: pos[2],
  }));

  const structureData = { lattice, sites };

  // Memoize CIF generation so it doesn't regenerate unnecessarily
  const cifText = useMemo(
    () => generateCIFfromMatrix(structureData),
    [structureData]
  );

  return (
    <div className={`relative rounded-lg w-full min-h-[450px] ${className}`}>
      {/* Visualizer fills container */}
      <div className="w-full h-[450px]">
        <StructureVisualizer key={cifText} cifText={cifText} />
      </div>

      {/* Centered QE Input button below visualizer */}
      <div className="flex justify-center mt-4">
        <QEInputButton
          cifText={cifText}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        />
      </div>

      {/* Top-right download dropdown (optional) */}
      <div className="absolute top-2 right-2 z-10">
        <StructureDownload OptimadeStructure={OptimadeStructure} />
      </div>
    </div>
  );
}
