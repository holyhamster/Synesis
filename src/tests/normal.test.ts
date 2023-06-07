import SynonymCloud from "../dictionaries/data/synonymCloud";
import { CalculateWeights } from "../dictionaries/data/wordNormal";

test("weight test", () => {
  const weights = CalculateWeights([1, 1, 1]);
  expect(weights[0] > weights[1] && weights[1] > weights[2]).toBeTruthy();
  const empty = CalculateWeights([]);
  expect(empty.length).toBe(0);
  const empty2 = CalculateWeights([0, 0, 0]);
  expect(empty.length).toBe(0);
  const lastOrder = CalculateWeights([0, 0, 1]);
  expect(lastOrder[2]).toBe(1);
});

test("Creating normal out of a cloud", () => {
  const ss = new SynonymCloud("cloud");
  ss.addConnection("name3", 1);
  ss.addConnection("name3", 1);
  ss.addConnection("name3", 1);
  ss.addConnection("name1", 0);
  ss.addConnection("name2", 2);

  const normal = ss.GetWordNormal();
  console.log(normal);
  let sorted = normal.sort((val1, val2) => val1.value - val2.value);
  expect(sorted[2].word).toBe("name1");
});
