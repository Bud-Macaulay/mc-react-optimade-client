export function buildQueryString(
  defaultNumElementsRange,
  defaultNumSitesRange,
  selectedElements,
  numElementsRange,
  numSitesRange
) {
  const parts = [];

  // Element selections
  const include = [];
  const exclude = [];
  for (const [symbol, state] of Object.entries(selectedElements)) {
    if (state === 1) include.push(symbol);
    if (state === 2) exclude.push(symbol);
  }

  if (exclude.length) {
    parts.push(
      `NOT elements HAS ANY ${exclude.map((e) => `"${e}"`).join(", ")}`
    );
  }
  if (include.length) {
    parts.push(`elements HAS ALL ${include.map((e) => `"${e}"`).join(", ")}`);
  }

  // Atom count filter
  if (numElementsRange[0] !== defaultNumElementsRange[0]) {
    parts.push(`nelements>=${numElementsRange[0]}`);
  }
  if (numElementsRange[1] !== defaultNumElementsRange[1]) {
    parts.push(`nelements<=${numElementsRange[1]}`);
  }

  // Site count filter
  if (numSitesRange[0] !== defaultNumSitesRange[0]) {
    parts.push(`nsites>=${numSitesRange[0]}`);
  }
  if (numSitesRange[1] !== defaultNumSitesRange[1]) {
    parts.push(`nsites<=${numSitesRange[1]}`);
  }

  return parts.join(" AND ");
}
