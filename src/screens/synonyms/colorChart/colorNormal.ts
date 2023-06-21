import WordNormal from "../../../dictionaries/data/wordNormal";
import Gradient from "./gradient";

// normal vector with colors as axis
// [{color:"red", value:.5}, {color:"blue", value:.5}]
export default class ColorNormal extends Array<{
  color: string;
  value: number;
}> {
  public IsValid = false;
  constructor(wordNormal: WordNormal, colorMap: Map<string, string>) {
    let validated = wordNormal.length > 0 && colorMap.size > 0;

    const array = wordNormal.map((val) => {
      const wordColor = colorMap.get(val.word);
      if (!wordColor) validated = false;
      return { color: wordColor, value: val.value };
    });

    super(...array);
    this.IsValid = validated;
  }

  isEqualTo(normal: ColorNormal) {
    const ln = this.length;
    if (ln != normal.length) return false;
    for (let i = 0; i < ln; i++) {
      if (this[i].color != normal[i].color || this[i].value != normal[i].value)
        return false;
    }
    return true;
  }

  //translates ColorNormal into a gradient for GradientRect component
  //[{color:"red", value: 0.5}, {color:"blue", value: 0.5}] => [{color:"red", start: 0, width: 0.5}, {color:"blue", start:0.5, width: 0.5}]
  ToGradient() {
    const sections = [];
    let start = 0;
    this.forEach((pair) => {
      sections.push({ color: pair.color, start: start, width: pair.value });
      start += pair.value;
    });
    return new Gradient(...sections);
  }

  getDominantColor() {
    let backgroundColorValue = 0;
    let ibackground: string = undefined;

    this.forEach((pair) => {
      if (pair.value > backgroundColorValue) {
        ibackground = pair.color;
        backgroundColorValue = pair.value;
      }
    });
    return ibackground;
  }
}
