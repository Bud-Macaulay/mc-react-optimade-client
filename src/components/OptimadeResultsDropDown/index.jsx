import { useEffect, useState } from "react";
import { SimpleDropDown } from "../common/SimpleDropDown";

export function OptimadeResultsDropdown({
  results,
  loading,
  selectedResult,
  onSelect,
}) {
  const options =
    results?.data?.map((result) => {
      const formula =
        result.attributes?.chemical_formula_descriptive || "Unknown";
      return {
        value: result.id,
        label: `${formula} (${result.id})`,
      };
    }) ?? [];

  const initialValue = selectedResult?.id || options[0]?.value || "";
  const [internalValue, setInternalValue] = useState(initialValue);

  // Automatically select first result if nothing is selected
  useEffect(() => {
    const firstValue = selectedResult?.id || options[0]?.value || "";
    setInternalValue(firstValue);

    if (!selectedResult && options.length > 0 && onSelect) {
      onSelect(results.data[0]);
    }
  }, [results, selectedResult]);

  const handleChange = (selectedOption) => {
    const val = selectedOption.value;
    setInternalValue(val);

    const chosen = results?.data?.find((r) => r.id === val);
    if (onSelect && chosen) onSelect(chosen);
  };

  return (
    <SimpleDropDown
      options={options}
      value={internalValue}
      onChange={handleChange}
      loading={loading}
      placeholder="-- No Data found --"
    />
  );
}
