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
//every next dimension takes a space less than a single unit of the previous one
//[1, 1, 1] => [0.65, 0.25, 0.1]
export function CalculateWeights(quantities: number[]) {
  const weights: number[] = [];
  const orderWeightIncrease = 0.3;
  let unitWeight = 1;
  let totalWeight = 0;
  for (let i = quantities.length - 1; i >= 0; i--) {
    const currentQ = quantities[i];
    weights[i] = currentQ ? unitWeight : 0;
    if (!currentQ) continue;

    const columnWeight = unitWeight * currentQ;
    totalWeight += columnWeight;
    unitWeight = Math.ceil(columnWeight * (1 + orderWeightIncrease));
  }

  return weights.map((val) => (totalWeight ? val / totalWeight : 0));
}
