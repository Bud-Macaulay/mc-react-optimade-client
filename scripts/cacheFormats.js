import fs from "fs";

// UNUSED caching methods that in theory reduce json file size by 3-10x,
// however since this json is cached by default its probably unneccessary to use these.

// prettier-ignore
export const ELEMENTS = [
  "H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar",
  "K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr",
  "Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe",
  "Cs","Ba","La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu",
  "Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn","Fr","Ra",
  "Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr",
  "Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Fl","Lv","Ts","Og"
];

export function saveBinaryCache(resultMap, outputPath) {
  const obj = {};
  for (const [providerUrl, ptable] of Object.entries(resultMap)) {
    let str;
    if (ptable.all === false) {
      str = "0".repeat(ELEMENTS.length);
    } else {
      str = ELEMENTS.map((el) => (el in ptable ? "0" : "1")).join("");
    }
    obj[providerUrl] = str;
  }

  fs.writeFileSync(outputPath, JSON.stringify(obj));
}

export function saveBitMapCache(resultMap, outputPath) {
  const obj = {};
  for (const [providerUrl, ptable] of Object.entries(resultMap)) {
    const bits = ELEMENTS.map((el) => {
      if (ptable.all === false) return 0;
      return el in ptable ? 0 : 1;
    });

    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
      const byte = bits
        .slice(i, i + 8)
        .reduce((acc, b, idx) => acc | (b << (7 - idx)), 0);
      bytes.push(byte);
    }

    const base64 = Buffer.from(bytes).toString("base64");
    obj[providerUrl] = base64;
  }

  fs.writeFileSync(outputPath, JSON.stringify(obj));
}
