import React, { useState, useRef, useEffect } from "react";

export function DropdownWithSpinner({
  options = [],
  value,
  onChange,
  placeholder = "-- Select --",
  width = "w-72",
  loading = false,
  showCustomInput = false,
  customValue,
  onCustomChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    setInternalValue(val);
    setIsOpen(false);
    if (val === "__custom__") {
      if (onChange) onChange(null);
    } else {
      if (onChange) onChange(val);
    }
  };

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      {/* Selected value box */}
      <div
        className="flex items-center justify-between border-2 border-slate-300 bg-slate-200 py-3 px-4 rounded shadow cursor-pointer hover:bg-slate-300 truncate"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {internalValue
            ? options.find((o) => o.value === internalValue)?.label ||
              internalValue
            : placeholder}
        </span>

        <div className="flex items-center space-x-2">
          {loading && (
            <div className="w-5 h-5 border-2 border-t-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
          )}
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="absolute left-0 right-0 max-h-60 overflow-auto border border-slate-300 bg-white rounded shadow mt-1 z-50">
          {options.map((opt) => (
            <li
              key={opt.value}
              className="truncate px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </li>
          ))}
          {showCustomInput && (
            <li
              className="truncate px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect("__custom__")}
            >
              Enter Custom Endpoint
            </li>
          )}
        </ul>
      )}

      {/* Custom input */}
      {internalValue === "__custom__" && showCustomInput && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange && onCustomChange(e.target.value)}
          placeholder="Enter custom endpoint URL"
          className="w-full mt-2 border-2 border-slate-300 bg-slate-200 py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}
