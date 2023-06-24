export function getRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

function getFreeColor(takenColors: string[]): string {
  const set = new Set(colors);
  for (const color of takenColors) set.delete(color);

  return set.size == 0
    ? getRandomColor()
    : Array.from(set)[Math.floor(Math.random() * set.size)];
}

export function RebuildColorMap<T>(oldMap: Map<T, string>, keys: T[]) {
  const takenColors = new Set<string>();
  oldMap.forEach((color, key) => {
    if (keys.includes(key)) takenColors.add(color);
  });

  const newColormap = new Map<T, string>();
  keys.forEach((key) => {
    const color = oldMap.get(key) || getFreeColor(Array.from(takenColors));
    newColormap.set(key, color);
    takenColors.add(color);
  });
  return newColormap;
}

const colors = [
  "#B66DFF",
  "#FF2A95",
  "#FFB6DB",
  "#4673FF",
  "#00A6A6",
  "#8CCAFF",
  "#FB6E6E",
  "#FFB488",
  "#24FF24",
];
export const DisabledGrey: string = "#7A7B7A";
export const BGWhite: string = "#FFFFFF";
export const AccentColor: string = "#eac8f7";
export const CountourColor: string = "#000000";
