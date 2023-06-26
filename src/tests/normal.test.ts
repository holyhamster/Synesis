import SynonymCloud from "../dictionaries/data/synonymCloud";
import WordNormal, { CalculateWeights } from "../dictionaries/data/wordNormal";

test("weight distribution", () => {
  const weights = CalculateWeights([1, 1, 1]);
  expect(weights[0] > weights[1]).toBeTruthy();
  expect(weights[1] > weights[2]).toBeTruthy();

  expect(CalculateWeights([]).length).toBe(0);

  expect(CalculateWeights([0, 0, 0])).toEqual([0, 0, 0]);

  expect(CalculateWeights([1, 0, 0])[0]).toBe(1);

  expect(CalculateWeights([0, 0, 1])[2]).toBe(1);

  expect(CalculateWeights([2, 0, 0])[0]).toBe(0.5);
});

test("connections affecting cloud's word normal", () => {
  const cloud = new SynonymCloud("cloud");

  cloud.addConnection("word1", 1);
  cloud.addConnection("word1", 1);
  cloud.addConnection("word2", 1);
  cloud.addConnection("word3", 2);

  const getWordWithBiggestValue = (normal: WordNormal) =>
    normal.sort((val1, val2) => val2.value - val1.value)[0].word;

  expect(getWordWithBiggestValue(cloud.GetWordNormal())).toBe("word1");

  cloud.addConnection("word1", 2);
  cloud.addConnection("word1", 2);

  expect(getWordWithBiggestValue(cloud.GetWordNormal())).toBe("word1");

  cloud.addConnection("word3", 0);
  expect(getWordWithBiggestValue(cloud.GetWordNormal())).toBe("word3");

  for (let i = 0; i < 100; i++) cloud.addConnection("word2", 1);
  expect(getWordWithBiggestValue(cloud.GetWordNormal())).toBe("word3");
});
