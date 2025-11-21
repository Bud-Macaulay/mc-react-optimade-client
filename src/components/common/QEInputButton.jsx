// TODO - add a Development domain of the qeinputgenerator and a flag to switch.
// Maybe extract this domain into the route of the project.
export default function QEInputButton({ cifText }) {
  const DOMAIN = "https://qeinputgenerator.materialscloud.io";

  const handleClick = async () => {
    if (!cifText) {
      alert("No CIF data available");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fileformat", "cif-ase");
      formData.append(
        "structurefile",
        new Blob([cifText], { type: "text/plain;charset=utf-8" }),
        "structure.cif"
      );

      const response = await fetch(`${DOMAIN}/compute/upload_structure/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const json = await response.json();

      if (json.redirect) {
        window.open(`${DOMAIN}${json.redirect}`, "_blank");
      } else {
        alert("Unexpected response from server");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload structure.");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!cifText}
      title="Use the chosen structure in the QE Input Generator Tool"
      className="px-2 py-1 md:px-4 md:py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 text-sm md:text-base"
    >
      Use in QE Input Generator
    </button>
  );
}
