import { EmptyColor } from "../colors";
import { APIResponse } from "../dictionaries/apiResponse";
import BuildDatamuse from "../dictionaries/datamuse";
import Dictionary from "../dictionaries/dictionary";
import BuildMeriam from "../dictionaries/meriam";
import { Cross } from "../screens/synonyms/data/dataEntry";
import SynonymCollection from "../screens/synonyms/data/synonymCollection";
const mockSynSets = new Map<string, string[][][]>();

mockSynSets.set("hand", [
  [
    ["angle", "aspect", "facet"],
    ["flank", "side"],
  ],
  [
    ["deliver", "give"],
    ["pass", "reach"],
  ],
]);
mockSynSets.set("reach", [
  [
    ["buck", "hand", "pass"],
    ["contact", "get"],
  ],
  [
    ["breadth", "distance"],
    ["ambit", "breadth"],
  ],
]);
mockSynSets.set("test1", [[["1"]]]);
mockSynSets.set("test2", [
  [
    ["test1", "2"],
    ["3", "4"],
  ],
  [
    ["1", "3"],
    ["5", "6"],
  ],
]);

const mockDictionary = {} as Dictionary;
mockDictionary.GetSynonyms = async (string: string) =>
  ({ data: mockSynSets.get(string), type: "success" } as APIResponse);

test("synonym initiation", async () => {
  const word = "hand";
  let synDef = new SynonymCollection(word);
  await synDef.Load(mockDictionary);
  synDef.WasFetched;
  expect(synDef.WasFetched).toBe(true);
  expect(synDef.IsEmpty).toBe(false);
  expect(synDef.Color).not.toBe(EmptyColor);
  expect(synDef.sets).toBe(mockSynSets.get(word));
});

test("synonym crossing", async () => {
  let synDef1 = new SynonymCollection("hand");
  await synDef1.Load(mockDictionary);
  let synDef2 = new SynonymCollection("reach");
  await synDef2.Load(mockDictionary);

  const results = Cross([synDef1, synDef2]);
  //expect(results).toBe(1);
  expect(results[results.length - 1].name).toBe("pass");
});

test("live test", async () => {
  var dict = BuildDatamuse();
  const syn1 = new SynonymCollection("sunday");
  const syn2 = new SynonymCollection("sun");
  await syn1.Load(dict);
  await syn2.Load(dict);

  const results = Cross([syn1, syn2]);
  expect(syn1).toBe(1);
  console.log(results);
  expect(results).toBe("pass");
});
