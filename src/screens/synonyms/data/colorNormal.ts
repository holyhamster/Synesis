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
}
