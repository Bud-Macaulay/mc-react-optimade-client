import { useMemo } from "react";
import StructureVisualizer from "mc-react-structure-visualizer";
import { StructureDownload } from "../common/StructureDownload";
import { generateCIFfromMatrix } from "../../utils";

import QEInputButton from "../common/QEInputButton";

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

      {/* Top-right download dropdown*/}
      <div className="absolute top-2 right-2 z-10">
        <StructureDownload OptimadeStructure={OptimadeStructure} />
      </div>
    </div>
  );
}
