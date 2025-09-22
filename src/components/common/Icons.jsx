export function DownloadIcon({
  data = null,
  downloadUrl = null,
  filename = "data.json",
  size = 14,
  className = "",
}) {
  const handleDownload = () => {
    if (downloadUrl) {
      // Directly download from provided URL
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
      return;
    }

    if (data) {
      // Fallback to JSON blob download
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      title="Download"
      className="p-1 hover:text-blue-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 15V3" />
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
      </svg>
    </button>
  );
}
