import { APIErrorEnum } from "../dictionaries/data/apiResponse";
import BuildDatamuse, { DatamuseParse } from "../dictionaries/datamuse";

const word = "hand";
const mockresponse = `[{"word":"list","score":5054},{"word":"lean","score":3439},{"word":"propensity","score":2071},{"word":"tilt","score":1472},{"word":"proclivity","score":1374},{"word":"inclination","score":1268},{"word":"tendency","score":1137},{"word":"inclined","score":903},{"word":"tilted","score":363},{"word":"canted","score":298},{"word":"atilt","score":277},{"word":"tipped","score":231},{"word":"unerect","score":29}]`;

test("parsing", async () => {
  const response: Response = new Response(mockresponse);
  var parsed = await DatamuseParse(word, response);

  expect(parsed.type).toBe("success");
  expect((parsed as any).data.length).toBeGreaterThan(0);
});

const validDictionary = BuildDatamuse();

test("successful fetch and parse", async () => {
  const response = await validDictionary.GetSynonyms(word);

  expect(response.type).toBe("success");
  expect((response as any).data.length).toBeGreaterThan(0);
});

test("non existant word", async () => {
  const response = await validDictionary.GetSynonyms("asfdasdasd");

  expect(response.type).toBe("error");
  expect((response as any).errorMessage).toBe(APIErrorEnum.NoWord);
});

test.skip("network unavailiable", async () => {
  const response = await validDictionary.GetSynonyms(word);

  expect(response.type).toBe("error");
  expect((response as any).errorMessage).toBe(APIErrorEnum.Network);
});
