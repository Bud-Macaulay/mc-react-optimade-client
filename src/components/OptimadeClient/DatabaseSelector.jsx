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

  const handleCustomChange = debounce((val) => setCustomUrl(val), 300);

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
        setChildSelected("");
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
    <div className="flex flex-col items-start space-y-2 w-full max-w-lg">
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
            key={p.attributes?.id || p.id}
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
          className="min-w-96"
          onChange={(e) => handleCustomChange(e.target.value)}
        />
      ) : (
        <select
          className={slateDropdown}
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
                <option key={c.id} value={c.base_url}>
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
