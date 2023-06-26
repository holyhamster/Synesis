import { APIResponse } from "../dictionaries/data/apiResponse";
import BuildDatamuse from "../dictionaries/datamuse";
import Dictionary from "../dictionaries/dictionary";
import SynonymCloud, {
  CrossReference,
} from "../dictionaries/data/synonymCloud";
import SynonymCollection from "../dictionaries/data/synonymCollection";
const mockSynSets = new Map<string, Set<string>[][]>();

const word1 = "hand";
const word2 = "reach";
mockSynSets.set("hand", [
  [
    new Set<string>(["angle", "aspect", "facet"]),
    new Set<string>(["flank", "side"]),
  ],
  [new Set<string>(["deliver", "give"]), new Set<string>(["pass", "reach"])],
]);
mockSynSets.set("reach", [
  [
    new Set<string>(["buck", "hand", "pass"]),
    new Set<string>(["contact", "get"]),
  ],
  [
    new Set<string>(["breadth", "distance"]),
    new Set<string>(["ambit", "breadth"]),
  ],
]);

const mockDictionary = {} as Dictionary;
mockDictionary.GetSynonyms = async (string: string) =>
  ({ data: mockSynSets.get(string), type: "success" } as APIResponse);

test("initiating and loading synonym", async () => {
  const word = "hand";
  const synonym1 = new SynonymCollection(word1);
  await synonym1.Load(mockDictionary);

  expect(synonym1.WasFetched).toBe(true);
  expect(synonym1.IsEmpty).toBe(false);
  expect(synonym1.definitionSets).toBe(mockSynSets.get(word));
});

test("crossing two synonyms", async () => {
  const synonym1 = new SynonymCollection(word1);
  const synonym2 = new SynonymCollection(word2);
  await synonym1.Load(mockDictionary);
  await synonym2.Load(mockDictionary);

  const results = CrossReference([synonym1, synonym2]);
  expect(results.length).toBeGreaterThan(0);
  //expect(results).toBe(1);
  expect(SynonymCloud.GetSorted(results, word1)[0].name).toBe("breadth");
  expect(SynonymCloud.GetSorted(results, word2)[0].name).toBe("angle");
});

test("live test", async () => {
  var dict = BuildDatamuse();
  const syn1 = new SynonymCollection("good");
  const syn2 = new SynonymCollection("angelic");
  await syn1.Load(dict);
  await syn2.Load(dict);

  const results = SynonymCloud.GetSorted(CrossReference([syn1, syn2]), "good");
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].name).toBe("sweet");
});
