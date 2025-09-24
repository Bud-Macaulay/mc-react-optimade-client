import React, { useState, useEffect } from "react";

export function QueryTextBox({
  value,
  onChange,
  placeholder = "Enter filter…",
  onSubmit,
  loading = false,
}) {
  return (
    <div className="space-y-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
