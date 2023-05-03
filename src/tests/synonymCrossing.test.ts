import { EmptyColor } from "../colors";
import Dictionary from "../dictionaries/dictionary";
import SynDefinition, { BuildPlus } from "../synDefinition";
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

const mockGetSynonyms = jest.fn(async (string: string) =>
  mockSynSets.get(string)
);

const mockDictionary = {
  GetSynonyms: (string) => mockGetSynonyms(string),
  Check: () => true,
} as Dictionary;

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

  const results = BuildPlus([synDef1, synDef2]);
  //expect(results).toBe(1);
  expect(results[results.length - 1].value).toBe("pass");
});
