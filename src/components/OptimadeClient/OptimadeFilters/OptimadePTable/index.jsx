import React from "react";
import { elements } from "./elements";

const defaultColors = {
  group1: "bg-[#d7bbbb]",
  group2: "bg-[#d7cdbb]",
  group17: "bg-[#d7d9c2]",
  group18: "bg-[#d0d5ee]",
  transition: "bg-[#c4d0d8]",
  lanthanide: "bg-[#e5cbee]",
  actinide: "bg-[#aebcee]",
  metalloid: "bg-[#cdd9c2]",
  postTransition: "bg-[#c2c8d9]",
  mainGroup: "bg-[#d9c2ce]",
  default: "bg-gray-200",
};

export default function PTable({
  selected = {},
  onSelectionChange,
  colors = defaultColors,
  selectedClassName = "bg-green-400 border border-green-700 text-white scale-105",
  deselectedClassName = "bg-red-400 border border-red-700 text-white scale-105",
  defaultBorderClassName = "border border-slate-700",
  hoverClassName = "transform transition-transform duration-100 hover:scale-105 hover:z-10",
}) {
  const toggle = (sym) => {
    if (!onSelectionChange) return;
    const newState = ((selected[sym] ?? 0) + 1) % 3;
    onSelectionChange({ [sym]: newState });
  };

  const getColorClass = (el) => {
    const state = selected[el.sym] ?? 0;
    let baseColor = colors[el.group] ?? colors.default;

    if (state === 1) return selectedClassName;
    if (state === 2) return deselectedClassName;
    return `${baseColor} ${defaultBorderClassName}`;
  };

  return (
    <div className="w-full max-w-full mx-auto p-0">
      <div
        className="grid gap-0.5 sm:gap-1 w-full"
        style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
      >
        {elements.map((el) => (
          <div
            key={el.sym}
            style={{ gridColumn: el.col, gridRow: el.row }}
            className="relative w-full"
          >
            <div className="w-full aspect-square">
              <button
                onClick={() => toggle(el.sym)}
                className={`flex flex-col justify-center items-center w-full h-full rounded-sm ${hoverClassName} ${getColorClass(
                  el
                )}`}
              >
                {/* Atomic number: hidden on very small screens, small on xs, bigger on sm+ */}
                <span className="text-[0%] xs:text-[0%] sm:text-[0%] md:text-[80%] lg:text-[100%] text-gray-700 leading-tight">
                  {el.num}
                </span>

                {/* Symbol: smaller on very tiny, slightly bigger on xs, full on sm+ */}
                <span className="text-[55%] xs:text-[100%] sm:text-[120%] md:text-[120%] lg:text-[125%] font-medium leading-none">
                  {el.sym}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
