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
  hoverClassName = "transform transition-transform duration-100 hover:scale-105 hover:z-10 hover:cursor-pointer",
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
      {/* Container that controls size queries below. */}
      <div className="@container">
        <div
          className="grid @gap-0.5 @sm:gap-1 w-full"
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
                  {/* Atomic number */}
                  <span
                    className="
                      text-[0px] opacity-0
                      @sm:text-[0.3rem] @sm:opacity-100
                      @md:text-[0.5rem]
                      @lg:text-[0.7rem]
                      text-gray-700 leading-tight
                    "
                  >
                    {el.num}
                  </span>

                  {/* Symbol */}
                  <span
                    className="
                      text-[0.55rem]
                      font-medium leading-none
                    "
                    style={{
                      fontSize: "clamp(0.55rem, 2.5vw, 1.25rem)", // min 0.55rem, scale, max 1.25rem
                    }}
                  >
                    {el.sym}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
