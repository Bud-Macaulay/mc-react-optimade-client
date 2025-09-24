export default function QuerySummary({ lastQuery, lastProviderUrl }) {
  return (
    <div className="w-full text-center text-sm text-gray-600 mt-2">
      <div>
        <strong>Last Query:</strong> {lastQuery || "None"}
      </div>
      <div>
        <strong>Last Provider URL:</strong> {lastProviderUrl || "None selected"}
      </div>
    </div>
  );
}
