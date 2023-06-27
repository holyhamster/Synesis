import BuildBHL, { BHLParse } from "../dictionaries/bighugelabs";
import { APIErrorEnum } from "../dictionaries/data/apiResponse";

const word = "hand";
const wordMockResponse = `{"noun":{"syn":["manus","mitt","paw","hired hand","hired man","handwriting","script","deal","bridge player","helping hand","ability","accumulation","aggregation","aid","applause","assemblage","assist","assistance","card player","clapping","collection","crewman","extremity","forepaw","hand clapping","handbreadth","handsbreadth","help","jack","laborer","labourer","manual laborer","pointer","power","sailor","side","writing"]},"verb":{"syn":["pass","reach","pass on","turn over","give","conduct","direct","guide","lead","take","transfer"],"rel":["pass on","hand down","hand out","hand over"]}}`;

test("parsing", async () => {
  const parser = BHLParse;
  let parsed = await parser(word, new Response(wordMockResponse));
  expect(parsed.type).toBe("success");
  expect((parsed as any).data.length).toBeGreaterThan(0);
});

const API_KEY = ``;
const validDictionary = API_KEY ? BuildBHL(API_KEY) : undefined;
const wrongKeyDictionary = BuildBHL("1234");

test("successful fetch and parse", async () => {
  expect(validDictionary).toBeTruthy();

  const response = await validDictionary.GetSynonyms(word);

  expect(response.type).toBe("success");
  expect((response as any).data.length).toBeGreaterThan(0);
});

test("non existant word", async () => {
  expect(validDictionary).toBeTruthy();

  const response = await validDictionary.GetSynonyms("skokfsddklfmsdkf");

  expect(response.type).toBe("error");
  expect((response as any).errorMessage).toBe(APIErrorEnum.NoWord);
});

test("wrong key", async () => {
  const response = await wrongKeyDictionary.GetSynonyms(word);

  expect(response.type).toBe("error");
  expect((response as any).errorMessage).toBe(APIErrorEnum.WrongAPIkey);
});

test.skip("network unavailiable", async () => {
  const response = await wrongKeyDictionary.GetSynonyms(word);

  expect(response.type).toBe("error");
  expect((response as any).errorMessage).toBe(APIErrorEnum.Network);
});
