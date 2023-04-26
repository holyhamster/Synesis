import { MerriamFetcher } from "../src/dictionaries/meriam/meriamFetcher";
import { MerriamParser } from "../src/dictionaries/meriam/meriamParser";

test("API key present", () => {
  expect(process.env.REACT_APP_API_KEY).toBeDefined();
});

const meriamMockResponse = `[{\"meta\":{\"id\":\"points of view\",\"uuid\":\"06da68ed-607d-44b6-88b6-cee51b552ec5\",\"src\":\"CTenhance\",\"section\":\"phrases\",\"stems\":[\"points of view\"],\"syns\":[[\"angles\",\"eye views\",\"outlooks\",\"perspectives\",\"shoes\",\"slants\",\"standpoints\",\"vantage points\",\"viewpoints\"]],\"ants\":[],\"offensive\":false},\"hwi\":{\"hw\":\"points of view\"},\"fl\":\"phrase\",\"sls\":[\"plural of {d_link|point of view|point of view}\"],\"def\":[{\"sseq\":[[[\"sense\",{\"dt\":[[\"text\",\"a way of looking at or thinking about something \"],[\"vis\",[{\"t\":\"From my {it}point of view{\\/it}, the best decision is to quit while we\\u0027re ahead.\"}]]],\"syn_list\":[[{\"wd\":\"angles\"},{\"wd\":\"eye views\"},{\"wd\":\"outlooks\"},{\"wd\":\"perspectives\"},{\"wd\":\"shoes\"},{\"wd\":\"slants\"},{\"wd\":\"standpoints\"},{\"wd\":\"vantage points\"},{\"wd\":\"viewpoints\"}]],\"rel_list\":[[{\"wd\":\"interpretations\"},{\"wd\":\"spins\"}],[{\"wd\":\"beliefs\"},{\"wd\":\"convictions\"},{\"wd\":\"eyes\"},{\"wd\":\"feelings\"},{\"wd\":\"judgments\",\"wvrs\":[{\"wvl\":\"or\",\"wva\":\"judgements\"}]},{\"wd\":\"minds\"},{\"wd\":\"mind-sets\"},{\"wd\":\"notions\"},{\"wd\":\"opinions\"},{\"wd\":\"perceptions\"},{\"wd\":\"persuasions\"},{\"wd\":\"sentiments\"},{\"wd\":\"verdicts\"},{\"wd\":\"views\"}],[{\"wd\":\"impressions\"},{\"wd\":\"takes\"}]],\"phrase_list\":[[{\"wd\":\"frames of reference\"}]]}]]]}],\"shortdef\":[\"a way of looking at or thinking about something\"]},{\"meta\":{\"id\":\"point of view\",\"uuid\":\"8446791b-ce99-4c36-9afa-91520d426674\",\"src\":\"CTenhance\",\"section\":\"phrases\",\"stems\":[\"point of view\",\"points of view\"],\"syns\":[[\"angle\",\"eye view\",\"outlook\",\"perspective\",\"shoes\",\"slant\",\"standpoint\",\"vantage point\",\"viewpoint\"]],\"ants\":[],\"offensive\":false},\"hwi\":{\"hw\":\"point of view\"},\"fl\":\"phrase\",\"def\":[{\"sseq\":[[[\"sense\",{\"dt\":[[\"text\",\"a way of looking at or thinking about something \"],[\"vis\",[{\"t\":\"From my {it}point of view{\\/it}, the best decision is to quit while we\\u0027re ahead.\"}]]],\"syn_list\":[[{\"wd\":\"angle\"},{\"wd\":\"eye view\"},{\"wd\":\"outlook\"},{\"wd\":\"perspective\"},{\"wd\":\"shoes\"},{\"wd\":\"slant\"},{\"wd\":\"standpoint\"},{\"wd\":\"vantage point\"},{\"wd\":\"viewpoint\"}]],\"rel_list\":[[{\"wd\":\"interpretation\"},{\"wd\":\"spin\"}],[{\"wd\":\"belief\"},{\"wd\":\"conviction\"},{\"wd\":\"eye\"},{\"wd\":\"feeling\"},{\"wd\":\"judgment\",\"wvrs\":[{\"wvl\":\"or\",\"wva\":\"judgement\"}]},{\"wd\":\"mind\"},{\"wd\":\"mind-set\"},{\"wd\":\"notion\"},{\"wd\":\"opinion\"},{\"wd\":\"perception\"},{\"wd\":\"persuasion\"},{\"wd\":\"sentiment\"},{\"wd\":\"verdict\"},{\"wd\":\"view\"}],[{\"wd\":\"impression\"},{\"wd\":\"take\"}]],\"phrase_list\":[[{\"wd\":\"frame of reference\"}]]}]]]}],\"shortdef\":[\"a way of looking at or thinking about something\"]}]`;
const correctionResponse = `["band","waned","want","hand","wound","land","bond","sand","wont","wad","wend","wan","wind","wane","windy","ward","went","bland","brand","grand"]`;
const emptyResponse = `[]`;
test.skip("Merriam API network response", async () => {
  var dict = new MerriamFetcher(process.env.REACT_APP_API_KEY);
  var response = await dict.FetchData("points_of_view");
  expect(response).toBe(meriamMockResponse);
});

test("Merriam API parsing", () => {
  var synDef = MerriamParser.ParseData(meriamMockResponse, "points of view");
  expect(synDef.IsEmpty).toBe(false);
});

test("Merriam API parsing, autocorrect", () => {
  expect(() =>
    MerriamParser.ParseData(correctionResponse, "wand")
  ).toThrowError("no word in the database");
});

test("Merriam API parsing, emptyResponse", () => {
  expect(() =>
    MerriamParser.ParseData(emptyResponse, "fasdnssobkjfd")
  ).toThrowError("no word in the database");
});
