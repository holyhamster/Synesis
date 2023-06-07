//normal vector of synonyms for a word
// [{word:"vague", value:.5}, {word:"undefined", value:.3}, {word:"inaccurate", value: .2}]
export default class WordNormal extends Array<{ word: string; value: number }> {
  constructor() {
    super();
  }

  public static Build(connections: Map<string, number[]>, sum: number[]) {
    const normal = new WordNormal();
    const connectionWeights = CalculateWeights(sum);

    for (const [word, mentions] of connections) {
      let val = 0;
      for (let i = 0; i < mentions.length; i++)
        val += connectionWeights[i] * mentions[i] || 0;

      normal.push({
        word: word,
        value: parseFloat(val.toFixed(5)),
      });
    }

    return normal;
  }

  public static Copy(copy: WordNormal) {
    return [...copy];
  }
}

//determines a weight of every dimension of the array for a total amount to be 1
//every next dimension takes a space equal to a single unit of the previous one
//[2, 0, 2] => [0.375/2, 0, 0.25/2]
export function CalculateWeights(sum: number[]) {
  const dWeigh: number[] = [];
  sum.forEach((_) => dWeigh.push(0));
  let valueLeft = 1;
  let valueSetAside = 0;
  let emptyDimensions = 0;
  const emptyDimensionPenalty = 0.5;
  for (let i = 0; i < dWeigh.length; i++) {
    if (!sum[i]) {
      emptyDimensions += 1;
      valueSetAside += valueLeft * emptyDimensionPenalty;
      valueLeft *= emptyDimensionPenalty;
    } else {
      const remainingParts = (sum[i] || 0) + 1;
      dWeigh[i] = valueLeft * (1 - 1 / remainingParts);
      valueLeft -= dWeigh[i];
    }
  }

  for (let i = 0; i < dWeigh.length; i++) {
    if (sum[i] == 0) continue;
    dWeigh[i] +=
      (valueLeft + valueSetAside) / (dWeigh.length - emptyDimensions);
  }

  return dWeigh.map((weight, index) => (sum[index] ? weight / sum[index] : 0));
}
