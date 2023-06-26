import { APIErrorEnum } from "../dictionaries/data/apiResponse";
import BuildDatamuse, { DatamuseParse } from "../dictionaries/datamuse";
import { CrossReference } from "../dictionaries/data/synonymCloud";
import SynonymCollection from "../dictionaries/data/synonymCollection";

const mockresponse = `[{"word":"list","score":5054},{"word":"lean","score":3439},{"word":"propensity","score":2071},{"word":"tilt","score":1472},{"word":"proclivity","score":1374},{"word":"inclination","score":1268},{"word":"tendency","score":1137},{"word":"inclined","score":903},{"word":"tilted","score":363},{"word":"canted","score":298},{"word":"atilt","score":277},{"word":"tipped","score":231},{"word":"unerect","score":29}]`;

test("Datamuse parse test", async () => {
  const parser = DatamuseParse;
  const response: Response = new Response(mockresponse, { status: 200 });
  var parsed = await parser("list", response);
  expect(parsed.type == "success" ? parsed.data.length : 0).toBeGreaterThan(0);

  parsed = await parser("", new Response("[]"));
  expect(parsed.type == "error" ? parsed.errorMessage : 0).toBe(
    APIErrorEnum.NoWord
  );
});

const datamuseDictionary = BuildDatamuse();
test("datamuse crossing", async () => {
  const synDef1 = new SynonymCollection("leaning");
  const synDef2 = new SynonymCollection("tilted");

  await synDef1.Load(datamuseDictionary);
  await synDef2.Load(datamuseDictionary);
  expect(CrossReference([synDef1, synDef2])).toBeTruthy();
});
