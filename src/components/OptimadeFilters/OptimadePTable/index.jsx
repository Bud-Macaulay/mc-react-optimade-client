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
  selected = {}, // { [symbol]: state }
  onSelectionChange, // callback to parent
  colors = defaultColors,
  defaultClassName = "rounded-sm items-center justify-center w-12 h-12",
  selectedClassName = "bg-green-400 border border-green-700 text-white scale-105",
  deselectedClassName = "bg-red-400 border border-red-700 text-white scale-105",
  defaultBorderClassName = "border border-slate-700",
  hoverClassName = "transform transition-transform duration-200 hover:scale-125 hover:z-50",
  elementNumberText = "text-[12px]",
  elementSymbolText = "font-md text-[20px]",
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
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: "repeat(18, 3em)" }}
    >
      {elements.map((el) => (
        <button
          key={el.sym}
          onClick={() => toggle(el.sym)}
          style={{ gridColumn: el.col, gridRow: el.row }}
          className={`flex flex-col justify-between ${defaultClassName} ${hoverClassName} ${getColorClass(
            el
          )}`}
        >
          <span className={elementNumberText}>{el.num}</span>
          <span className={elementSymbolText}>{el.sym}</span>
        </button>
      ))}
    </div>
  );
}
