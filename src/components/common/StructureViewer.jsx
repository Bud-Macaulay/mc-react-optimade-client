import React, { useEffect, useRef } from "react";
import * as NGL from "ngl";

const StructureViewer = () => {
  const stageRef = useRef();

  useEffect(() => {
    // Create NGL Stage
    const stage = new NGL.Stage(stageRef.current);

    // Handle window resize
    const handleResize = () => stage.handleResize();
    window.addEventListener("resize", handleResize);

    // Add static datasource
    NGL.DatasourceRegistry.add(
      "data",
      new NGL.StaticDatasource(
        "https://raw.githubusercontent.com/nglviewer/ngl/refs/tags/v2.4.0/data/"
      )
    );

    stage.setParameters({
      cameraType: "orthographic",
      clipDist: 0,
    });

    // Load CIF file
    stage
      .loadFile("data://Fe2O3_mp-715572_conventional_standard.cif", {
        defaultRepresentation: false,
      })
      .then((component) => {
        // Check that structure is ready
        if (!component.structure) {
          console.error("Structure not parsed yet.");
          return;
        }

        // Add representations
        component.addRepresentation("licorice");
        component.addRepresentation("spacefill", { radiusScale: 0.25 });
        component.addRepresentation("unitcell");

        stage.autoView();
      })
      .catch((err) => {
        console.error("Error loading CIF file:", err);
      });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      stage.dispose();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
    />
  );
};

export default StructureViewer;
