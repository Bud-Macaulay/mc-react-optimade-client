import { useState, useRef, useEffect } from "react";
import { DownloadIcon } from "./Icons";

import {
  generateCIFfromMatrix,
  generatePOSCAR,
  generateXSF,
  generateXYZ,
} from "../../utils";

const defaultFormats = [
  { format: "json", label: "JSON" },
  { format: "cif", label: "CIF" },
  { format: "xyz", label: "XYZ" },
  { format: "xsf", label: "XSF" },
  { format: "poscar", label: "VASP" },
];

// === Download Helper ===
function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// === React Component ===
export function StructureDownload({ OptimadeStructure, download_formats }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const downloadFormats = download_formats || defaultFormats;

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

  const handleDownload = (format) => {
    let content = "";
    let filename = "structure";

    if (format === "cif") {
      content = generateCIFfromMatrix(structureData);
      filename += ".cif";
    } else if (format === "xyz") {
      content = generateXYZ(structureData);
      filename += ".xyz";
    } else if (format === "poscar") {
      content = generatePOSCAR(structureData);
      filename += ".vasp";
    } else if (format === "xsf") {
      content = generateXSF(structureData);
      filename += ".xsf";
    } else if (format === "json") {
      content = JSON.stringify(OptimadeStructure, null, 2);
      filename += ".json";
    }

    if (content) downloadFile(content, filename);
    setOpen(false);
  };

  // === Cleaner outside click handler ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-2 py-2 text-sm bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 cursor-pointer"
        title="Download"
      >
        <DownloadIcon />
      </div>
      {open && (
        <div className="absolute right-0 mt-1 bg-white rounded-md shadow-md ring-2 ring-black ring-opacity-5 z-10">
          <ul className="list-none p-0 m-0">
            {downloadFormats.map(({ format, label }) => (
              <li key={format}>
                <button
                  onClick={() => handleDownload(format)}
                  className="block w-full text-left px-3 py-1.5 text-sm text-black hover:bg-gray-100"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
