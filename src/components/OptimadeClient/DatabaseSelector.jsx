import { useState, useEffect } from "react";
import { getProviderLinks } from "../../api";
import debounce from "lodash.debounce";
import { slateDropdown } from "../../styles/dropdownStyles";

export function DatabaseSelector({
  providers,
  onQueryUrlChange,
  onChildChange,
}) {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [childEntries, setChildEntries] = useState([]);
  const [childSelected, setChildSelected] = useState(null);
  const [customUrl, setCustomUrl] = useState("");
  const [loadingChildren, setLoadingChildren] = useState(false);

  const handleCustomChange = debounce((val) => setCustomUrl(val), 700);

  useEffect(() => {
    if (!selectedProvider) {
      setChildEntries([]);
      setChildSelected(null);
      onQueryUrlChange("");
      onChildChange?.(null);
      return;
    }

    if (selectedProvider === "__custom__") {
      setChildEntries([]);
      setChildSelected(null);
      onQueryUrlChange(customUrl || "");
      onChildChange?.(null);
      return;
    }

    async function fetchChildren() {
      try {
        setLoadingChildren(true);
        const { children } = await getProviderLinks(selectedProvider);

        const entries = children.map((c) => ({
          id: c.id,
          ...(c.attributes ?? {}),
        }));

        setChildEntries(entries);

        if (entries.length === 1) {
          setChildSelected(entries[0]);
          onQueryUrlChange(entries[0].base_url);
          onChildChange?.(entries[0]);
        } else {
          setChildSelected(null);
          onQueryUrlChange("");
          onChildChange?.(null);
        }
      } catch (err) {
        console.error(err);
        setChildEntries([]);
        setChildSelected(null);
        onQueryUrlChange("");
        onChildChange?.(null);
      } finally {
        setLoadingChildren(false);
      }
    }

    fetchChildren();
  }, [selectedProvider]);

  useEffect(() => {
    if (selectedProvider === "__custom__") {
      onQueryUrlChange(customUrl || "");
      onChildChange?.(null);
    } else if (childSelected) {
      onQueryUrlChange(childSelected.base_url);
      onChildChange?.(childSelected);
    }
  }, [customUrl, childSelected, selectedProvider]);

  return (
    <div className="flex flex-col items-start space-y-2 max-w-md">
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
            {`${p.attributes?.name} - ${p.id}`}
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
          className={slateDropdown}
          value={childSelected?.id || ""}
          onChange={(e) => {
            const selected = childEntries.find((c) => c.id === e.target.value);
            setChildSelected(selected || null);
          }}
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
                <option key={c.id} value={c.id}>
                  {`${c.id} - ${c.name}`}
                </option>
              ))}
            </>
          )}
        </select>
      )}
    </div>
  );
}
