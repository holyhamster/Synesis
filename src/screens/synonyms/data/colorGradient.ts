export default class ColorGradient {
  colors: string[];
  locations: number[];

  constructor(colorNormal: { color: string; value: number }[]) {
    this.colors = [];
    this.locations = [];
    let i: number = 0;
    colorNormal.forEach((pair) => {
      this.colors.push(pair.color, pair.color);
      this.locations.push(i);
      i += 1 / colorNormal.length;
      this.locations.push(i);
    });
  }
}
