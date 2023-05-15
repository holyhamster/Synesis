import { EmptyColor } from "../colors";
import { APIResponse } from "../dictionaries/apiResponse";
import Dictionary from "../dictionaries/dictionary";
import BuildMeriam from "../dictionaries/meriam";
import { Cross } from "../screens/synonyms/data/dataEntry";
import SynDefinition from "../screens/synonyms/data/synDefinition";
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
  let synDef = new SynDefinition(word);
  await synDef.Load(mockDictionary);
  synDef.WasFetched;
  expect(synDef.WasFetched).toBe(true);
  expect(synDef.IsEmpty).toBe(false);
  expect(synDef.Color).not.toBe(EmptyColor);
  expect(synDef.sets).toBe(mockSynSets.get(word));
});

test("synonym crossing", async () => {
  let synDef1 = new SynDefinition("hand");
  await synDef1.Load(mockDictionary);
  let synDef2 = new SynDefinition("reach");
  await synDef2.Load(mockDictionary);

  const results = Cross([synDef1, synDef2]);
  //expect(results).toBe(1);
  expect(results[results.length - 1].name).toBe("pass");
});

test.skip("live test", async () => {
  var dict = BuildMeriam(process.env.REACT_APP_API_KEY);
  const syn1 = new SynDefinition("sun");
  const syn2 = new SynDefinition("glory");
  await syn1.Load(dict);
  await syn2.Load(dict);

  const results = Cross([syn1, syn2]);
  //expect(results).toBe(1);
  expect(results[results.length - 1].name).toBe("pass");
});
