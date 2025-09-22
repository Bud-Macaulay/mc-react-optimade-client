import { useState } from "react";

import StructureVisualizer from "mc-react-structure-visualizer";

// import { StructureVisualizer } from "mc-react-structure-visualizer";

import { StructureDownload } from "../common/StructureDownload";
import { generateCIFfromMatrix } from "../../utils";

export function StructureViewerWithDownload({ OptimadeStructure }) {
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

  // Generate CIF string for the visualizer
  const cifText = generateCIFfromMatrix(structureData);

  return (
    <div className="relative w-full h-full border rounded-lg overflow-hidden">
      {/* Top-right download dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <StructureDownload OptimadeStructure={OptimadeStructure} />
      </div>

      {/* Visualizer fills container */}
      <StructureVisualizer cifText={cifText} />
    </div>
  );
}
