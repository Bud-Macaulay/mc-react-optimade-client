// container styles build atop baseContainer
// size should be largely controlled by an outer div.

const baseContainer =
  "w-full border border-slate-500 rounded-sm bg-slate-50 shadow-sm ";

export const containerStyle = baseContainer + " p-2";

export const containerStyleDropdown =
  baseContainer + " overflow-hidden text-[11px] md:text-[13px]";

export const containerStyleHalf =
  containerStyleDropdown +
  ` p-2 md:w-1/2  min-h-48 md:h-[450px] h-[200px]
   overflow-auto`;

export const warningContainerStyle =
  "w-full rounded-sm bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 text-center";
