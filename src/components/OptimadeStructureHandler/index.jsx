import { useMemo } from "react";
import StructureVisualizer from "mc-react-structure-visualizer";
import { StructureDownload } from "../common/StructureDownload";
import { generateCIFfromMatrix } from "../../utils";

import { textError, textNormal } from "../../styles/textStyles";
import { containerStyle } from "../../styles/containerStyles";

export function StructureViewerWithDownload({ OptimadeStructure }) {
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
        className={`${containerStyle} min-h-[450px] flex items-center justify-center`}
      >
        <div className={textError}>
          <p>Unexpected or malformed data format found. </p>
          <p>--</p>

          <p>Crystal structure rendering skipped...</p>
        </div>
      </div>
    );

  return (
    <div className={`relative min-h-[450px] `}>
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
