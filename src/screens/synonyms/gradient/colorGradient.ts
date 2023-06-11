import ColorNormal from "./colorNormal";

//translates ColorNormal into a gradient for GradientRect component
//["red": 0.5, "blue": 0.5] => {colors: ["red", "red", "blue", "blur"], locations:[0, .5, .5, 1]}
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
