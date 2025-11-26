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

import { baseButtonStyle } from "../../styles/buttonStyles";
import { textSmall } from "../../styles/textStyles";

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
  const sitesRaw =
    OptimadeStructure?.attributes?.cartesian_site_positions || [];
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

  // === outside click handler ===
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
        className={`${baseButtonStyle} ${textSmall} py-2! px-2!`}
        title="Download"
      >
        <DownloadIcon />
      </div>
      {open && (
        <div className="absolute right-0 mt-0.5 bg-white rounded-sm shadow-sm ring-1 ring-slate-500 z-100">
          <ul>
            {downloadFormats.map(({ format, label }) => (
              <li key={format}>
                <button
                  onClick={() => handleDownload(format)}
                  className={`${textSmall} w-full text-left px-3 py-1.25 text-slate-700 hover:bg-gray-100 hover:cursor-pointer`}
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
