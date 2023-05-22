import WordNormal from "./wordNormal";

// [{color:"red", value:.5}, {color:"blue", value:.5}]
export default class ColorNormal extends Array<{
  color: string;
  value: number;
}> {
  isValid: boolean;
  constructor(wordNormal: WordNormal, colorMap: Map<string, string>) {
    let validated = wordNormal.length > 0 && colorMap.size > 0;
    const array = wordNormal.map((val) => {
      const wordColor = colorMap.get(val.word);
      if (!wordColor) validated = false;
      return { color: wordColor, value: val.value };
    });
    super(...array);
    this.isValid = validated;
  }

  isEqual(normal: ColorNormal) {
    if (this.length != normal.length) return false;
    for (let i = 0; i < this.length; i++) {
      if (this[i].color != normal[i].color || this[i].value != normal[i].value)
        return false;
    }
    return true;
  }

  getGradientValues(): [number[], string[]] {
    const location: number[] = [];
    const colors: string[] = [];

    let cycleValue = 0;
    for (let i = 0; i < this.length; i++) {
      location.push(cycleValue, cycleValue + this[i].value);
      colors.push(this[i].color, this[i].color);
      cycleValue += this[i].value;
    }

    return [location, colors];
  }
}
