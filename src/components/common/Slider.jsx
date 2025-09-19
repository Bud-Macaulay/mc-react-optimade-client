import React, { useState } from "react";

export default function Slider({
  title = "value",
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) {
  const [value, setValue] = useState((min + max) / 2);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="text-center font-medium">
        {`${title}:`} <span className="text-blue-600">{value}</span>
      </div>
    </div>
  );
}
