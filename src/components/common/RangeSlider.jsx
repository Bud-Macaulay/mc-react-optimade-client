import { Range } from "react-range";
import React from "react";

export default function RangeSlider({ title, value, onChange, min, max }) {
  return (
    <div className="my-4">
      <label className="block font-bold mb-1">{title}</label>
      <Range
        step={1}
        min={min}
        max={max}
        values={value}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div {...props} className="w-full h-2 bg-gray-300 rounded relative">
            <div
              className="absolute h-2 bg-blue-400 rounded"
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
            className="w-4 h-4 bg-white border border-gray-400 rounded-full"
          />
        )}
      />
      <div className="flex justify-between text-sm mt-1">
        <span>{value[0]}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  );
}
