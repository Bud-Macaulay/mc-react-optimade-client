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
  const sitesRaw =
    OptimadeStructure?.attributes?.cartesian_site_positions || null;
  const species = OptimadeStructure.attributes.species_at_sites;

  let sites = [];
  if (sitesRaw) {
    sites = sitesRaw.map((pos, i) => ({
      element: species[i],
      x: pos[0],
      y: pos[1],
      z: pos[2],
    }));
  }

  const structureData = { lattice, sites };

  // Memoize CIF generation so it doesn't regenerate unnecessarily
  const cifText = useMemo(
    () => generateCIFfromMatrix(structureData),
    [structureData]
  );

  // TODO - add error sign.
  if (!sitesRaw)
    return (
      <div
        className={`relative rounded-sm w-full px-20 min-h-[450px] ${className} flex items-center justify-center border-1 border-slate-500`}
      >
        <div className="text-red-500 text-center">
          Malformed data found - skipping the crystal structure rendering.
        </div>
      </div>
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
