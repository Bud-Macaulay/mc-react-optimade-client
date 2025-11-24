import { mat3, vec3 } from "gl-matrix";

// === Helper functions using gl-matrix ===
export function vecLength(v) {
  return vec3.length(v);
}

export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function cartesianToFractional(cartSites, latticeMatrix) {
  // Expect latticeMatrix = [aVec, bVec, cVec] where each Vec = [x,y,z]
  const a = latticeMatrix[0];
  const b = latticeMatrix[1];
  const c = latticeMatrix[2];

  // Build mat3 with columns = aVec, bVec, cVec (column-major order)
  const L = mat3.fromValues(
    a[0],
    a[1],
    a[2],
    b[0],
    b[1],
    b[2],
    c[0],
    c[1],
    c[2]
  );

  const invL = mat3.create();
  if (!mat3.invert(invL, L)) throw new Error("Singular lattice matrix");

  return cartSites.map((site) => {
    const cart = vec3.fromValues(site.x, site.y, site.z);
    const frac = vec3.create();
    vec3.transformMat3(frac, cart, invL);
    return { element: site.element, x: frac[0], y: frac[1], z: frac[2] };
  });
}

export function latticeMatrixToCIFParams(L) {
  const aVec = vec3.fromValues(...L[0]);
  const bVec = vec3.fromValues(...L[1]);
  const cVec = vec3.fromValues(...L[2]);
  const a = vecLength(aVec);
  const b = vecLength(bVec);
  const c = vecLength(cVec);

  const cosAlpha = Math.min(1, Math.max(-1, vec3.dot(bVec, cVec) / (b * c)));
  const cosBeta = Math.min(1, Math.max(-1, vec3.dot(aVec, cVec) / (a * c)));
  const cosGamma = Math.min(1, Math.max(-1, vec3.dot(aVec, bVec) / (a * b)));

  const alpha = radToDeg(Math.acos(cosAlpha));
  const beta = radToDeg(Math.acos(cosBeta));
  const gamma = radToDeg(Math.acos(cosGamma));

  return { a, b, c, alpha, beta, gamma };
}

export function generateCIFfromMatrix(structureData) {
  const { lattice, sites } = structureData;
  const fracSites = cartesianToFractional(sites, lattice);
  const { a, b, c, alpha, beta, gamma } = latticeMatrixToCIFParams(lattice);

  let cif = `data_generated_structure
_symmetry_space_group_name_H-M   'P 1'
_cell_length_a   ${a.toFixed(6)}
_cell_length_b   ${b.toFixed(6)}
_cell_length_c   ${c.toFixed(6)}
_cell_angle_alpha   ${alpha.toFixed(6)}
_cell_angle_beta    ${beta.toFixed(6)}
_cell_angle_gamma   ${gamma.toFixed(6)}

loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
`;

  fracSites.forEach((site, index) => {
    cif += `${site.element}${index + 1} ${site.element} ${site.x.toFixed(
      6
    )} ${site.y.toFixed(6)} ${site.z.toFixed(6)}\n`;
  });

  return cif;
}

export function generateXYZ(structureData) {
  const { lattice, sites } = structureData;
  const numAtoms = sites.length;

  // Flatten lattice vectors into row-major array
  const latticeFlat = lattice
    .flat()
    .map((x) => x.toFixed(6))
    .join(" ");

  let xyz = `${numAtoms}\n`;
  xyz += `Lattice="${latticeFlat}" Properties=species:S:1:pos:R:3\n`;

  sites.forEach((site) => {
    xyz += `${site.element} ${site.x.toFixed(6)} ${site.y.toFixed(
      6
    )} ${site.z.toFixed(6)}\n`;
  });

  return xyz;
}

export function generatePOSCAR(structureData) {
  const { lattice, sites } = structureData;

  // Gather unique species in order
  const speciesSet = [...new Set(sites.map((s) => s.element))];
  const speciesCounts = speciesSet.map(
    (sp) => sites.filter((s) => s.element === sp).length
  );

  // Lattice vectors as strings
  const latticeLines = lattice
    .map((v) => v.map((x) => x.toFixed(6)).join(" "))
    .join("\n");

  // Site coordinates in Cartesian
  const coords = speciesSet.flatMap((sp) =>
    sites
      .filter((s) => s.element === sp)
      .map((s) => `${s.x.toFixed(6)} ${s.y.toFixed(6)} ${s.z.toFixed(6)}`)
  );

  return [
    "Generated structure from OPTIMADE CLIENT", // comment line
    "1.0", // no scaling
    latticeLines,
    speciesSet.join(" "), // element symbols
    speciesCounts.join(" "), // number of atoms per element
    "Cartesian", // coordinates type
    ...coords,
  ].join("\n");
}

export function generateXSF(structureData) {
  const { lattice, sites } = structureData;
  let xsf = "CRYSTAL\nPRIMVEC\n";

  lattice.forEach((v) => {
    xsf += v.map((x) => x.toFixed(6)).join(" ") + "\n";
  });

  xsf += `PRIMCOORD\n${sites.length} 1\n`; // 1 = Cartesian
  sites.forEach((site) => {
    xsf += `${site.element} ${site.x.toFixed(6)} ${site.y.toFixed(
      6
    )} ${site.z.toFixed(6)}\n`;
  });

  return xsf;
}
