export function getRandomColor(): SynDefColor {
  let randomNumber = Math.floor(Math.random() * 16777216);
  let hexString = randomNumber.toString(16).padStart(6, "0");
  return "#" + hexString;
}

export function getFreeColor(takenColors: SynDefColor[]): SynDefColor {
  //TODO: make an array of premade colors, make this function pick a non-busy one
  return getRandomColor();
}

export const EmptyColor: SynDefColor = "#7A7B7A";

export type SynDefColor = string;
