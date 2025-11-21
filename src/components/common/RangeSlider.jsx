import { Range } from "react-range";
import React from "react";

export default function RangeSlider({ title, value, onChange, min, max }) {
  return (
    <div className="my-4 text-sm md:text-base">
      <label className="block font mb-1">{title}</label>
      <Range
        step={1}
        min={min}
        max={max}
        values={value}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div {...props} className="w-full h-2 bg-gray-300 rounded relative">
            <div
              className="absolute h-2 bg-blue-500 rounded"
              style={{
                left: `${((value[0] - min) / (max - min)) * 100}%`,
                width: `${((value[1] - value[0]) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-5 h-5 bg-white border border-gray-500 rounded-full"
          />
        )}
      />
      <div className="flex justify-between text-xs md:text-sm pt-2">
        <span>{value[0]}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  );
}
