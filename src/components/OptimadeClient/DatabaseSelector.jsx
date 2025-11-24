import { useState, useEffect } from "react";
import { getProviderLinks } from "../../api";
import debounce from "lodash.debounce";
import { slateDropdown } from "../../styles/dropdownStyles";

export function DatabaseSelector({ providers, onQueryUrlChange }) {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [childEntries, setChildEntries] = useState([]);
  const [childSelected, setChildSelected] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [loadingChildren, setLoadingChildren] = useState(false);

  // 700 ms between no typing before setting url.
  const handleCustomChange = debounce((val) => setCustomUrl(val), 700);

  useEffect(() => {
    if (!selectedProvider || selectedProvider === "__custom__") {
      setChildEntries([]);
      setChildSelected("");
      onQueryUrlChange(customUrl || "");
      return;
    }

    async function fetchChildren() {
      try {
        setLoadingChildren(true); // start loading
        const { children } = await getProviderLinks(selectedProvider);
        const entries = children.map((c) => c.attributes || {});
        setChildEntries(entries);

        if (entries.length === 1) {
          // Auto-select the only child
          setChildSelected(entries[0].base_url);
        } else {
          setChildSelected("");
        }
      } catch (err) {
        console.error(err);
        setChildEntries([]);
        setChildSelected("");
      } finally {
        setLoadingChildren(false); // stop loading
      }
    }

    fetchChildren();
  }, [selectedProvider]);

  useEffect(() => {
    const url =
      selectedProvider === "__custom__"
        ? customUrl
        : childSelected
        ? childSelected
        : "";
    onQueryUrlChange(url);
  }, [selectedProvider, childSelected, customUrl, onQueryUrlChange]);

  return (
    <div className="flex flex-col items-start space-y-2 w-full max-w-md">
      <select
        className={slateDropdown}
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
      >
        <option value="" disabled>
          Select a provider…
        </option>
        {providers.map((p) => (
          <option
            key={p.attributes?.id ?? p.id ?? p.attributes?.base_url}
            value={p.attributes?.base_url || ""}
          >
            {p.attributes?.name || p.id}
          </option>
        ))}
        <option value="__custom__">Custom endpoint…</option>
      </select>

      {selectedProvider === "__custom__" ? (
        <input
          type="text"
          placeholder="Enter custom URL"
          className="w-[calc(100%-4px)] mx-auto ring-[1px] ring-slate-300 rounded-sm px-2 py-1"
          onChange={(e) => handleCustomChange(e.target.value)}
        />
      ) : (
        <select
          className={`${slateDropdown}`}
          value={childSelected}
          onChange={(e) => setChildSelected(e.target.value)}
          disabled={loadingChildren}
        >
          {loadingChildren ? (
            <option>Loading…</option>
          ) : (
            <>
              <option value="" disabled>
                Select a subdatabase…
              </option>
              {childEntries.map((c) => (
                <option key={c.id ?? c.base_url ?? c.name} value={c.base_url}>
                  {c.name}
                </option>
              ))}
            </>
          )}
        </select>
      )}
    </div>
  );
}
