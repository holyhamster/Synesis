import { DisabledGrey } from "../colors";
import { APIResponse } from "../dictionaries/data/apiResponse";
import BuildDatamuse from "../dictionaries/datamuse";
import Dictionary from "../dictionaries/dictionary";
import { CrossReference } from "../dictionaries/data/synonymCloud";
import SynonymCollection from "../dictionaries/data/synonymCollection";
const mockSynSets = new Map<string, Set<string>[][]>();

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
mockSynSets.set("test1", [[new Set<string>(["1"])]]);
mockSynSets.set("test2", [
  [new Set<string>(["test1", "2"]), new Set<string>(["3", "4"])],
  [new Set<string>(["1", "3"]), new Set<string>(["5", "6"])],
]);

const mockDictionary = {} as Dictionary;
mockDictionary.GetSynonyms = async (string: string) =>
  ({ data: mockSynSets.get(string), type: "success" } as APIResponse);

test("synonym initiation", async () => {
  const word = "hand";
  let synDef = new SynonymCollection(word, "red");
  await synDef.Load(mockDictionary);
  synDef.WasFetched;
  expect(synDef.WasFetched).toBe(true);
  expect(synDef.IsEmpty).toBe(false);
  expect(synDef.Color).not.toBe(DisabledGrey);
  expect(synDef.definitionSets).toBe(mockSynSets.get(word));
});

test("synonym crossing", async () => {
  let synDef1 = new SynonymCollection("hand", "red");
  await synDef1.Load(mockDictionary);
  let synDef2 = new SynonymCollection("reach", "red");
  await synDef2.Load(mockDictionary);

  const results = CrossReference([synDef1, synDef2]);
  //expect(results).toBe(1);
  expect(results[results.length - 1].name).toBe("pass");
});

test("live test", async () => {
  var dict = BuildDatamuse();
  const syn1 = new SynonymCollection("good", "red");
  const syn2 = new SynonymCollection("angelic", "blue");
  await syn1.Load(dict);
  await syn2.Load(dict);

  const results = CrossReference([syn1, syn2]);
  results.forEach((cloud) =>
    console.log(cloud.name, cloud.connections, cloud.GetWordNormal())
  );
  expect(results).toBe("pass");
});
