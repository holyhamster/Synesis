import ColorNormal from "./colorNormal";

export default class ColorGradient {
  colors: string[];
  locations: number[];

  constructor(colorNormal: ColorNormal) {
    this.colors = [];
    this.locations = [];
    let i: number = 0;
    colorNormal.forEach((pair) => {
      this.colors.push(pair.color, pair.color);
      this.locations.push(i);
      i += pair.value;
      this.locations.push(i);
    });
  }
}
