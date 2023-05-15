export function getRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
  //let randomNumber = Math.floor(Math.random() * 16777216);
  //let hexString = randomNumber.toString(16).padStart(6, "0");
  //return "#" + hexString;
}

export function getFreeColor(takenColors: string[]): string {
  //TODO: make an array of premade colors, make this function pick a non-busy one
  return getRandomColor();
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
export const EmptyColor: string = "#7A7B7A";
