import BuildBHL, { BHLParse } from "../dictionaries/bighugelabs";
import { APIErrorEnum } from "../dictionaries/data/apiResponse";
import SynonymCollection from "../dictionaries/data/synonymCollection";

const API_KEY = `your_api_key`;
const word = "hand";
const wordMockResponse = `{"noun":{"syn":["manus","mitt","paw","hired hand","hired man","handwriting","script","deal","bridge player","helping hand","ability","accumulation","aggregation","aid","applause","assemblage","assist","assistance","card player","clapping","collection","crewman","extremity","forepaw","hand clapping","handbreadth","handsbreadth","help","jack","laborer","labourer","manual laborer","pointer","power","sailor","side","writing"]},"verb":{"syn":["pass","reach","pass on","turn over","give","conduct","direct","guide","lead","take","transfer"],"rel":["pass on","hand down","hand out","hand over"]}}`;

const typoWord = "sdfamsdfl";

test("BHL parse test", async () => {
  const parser = BHLParse;
  let parsed = await parser(word, new Response(wordMockResponse));
  expect(parsed.type == "success" ? parsed.data.length : 0).toBeGreaterThan(0);
});

test("live BHL test", async () => {
  const dictionary = BuildBHL(API_KEY);
  const synonym = new SynonymCollection(`hand`);
  const response = await synonym.Load(dictionary);

  expect(synonym.definitionSets).toBe(0);
});
