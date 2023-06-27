import { APIErrorEnum } from "../dictionaries/data/apiResponse";
import BuildMeriam, { MeriamParse } from "../dictionaries/meriam";

const word = "points of view";
const meriamMockResponse = `[{\"meta\":{\"id\":\"points of view\",\"uuid\":\"06da68ed-607d-44b6-88b6-cee51b552ec5\",\"src\":\"CTenhance\",\"section\":\"phrases\",\"stems\":[\"points of view\"],\"syns\":[[\"angles\",\"eye views\",\"outlooks\",\"perspectives\",\"shoes\",\"slants\",\"standpoints\",\"vantage points\",\"viewpoints\"]],\"ants\":[],\"offensive\":false},\"hwi\":{\"hw\":\"points of view\"},\"fl\":\"phrase\",\"sls\":[\"plural of {d_link|point of view|point of view}\"],\"def\":[{\"sseq\":[[[\"sense\",{\"dt\":[[\"text\",\"a way of looking at or thinking about something \"],[\"vis\",[{\"t\":\"From my {it}point of view{\\/it}, the best decision is to quit while we\\u0027re ahead.\"}]]],\"syn_list\":[[{\"wd\":\"angles\"},{\"wd\":\"eye views\"},{\"wd\":\"outlooks\"},{\"wd\":\"perspectives\"},{\"wd\":\"shoes\"},{\"wd\":\"slants\"},{\"wd\":\"standpoints\"},{\"wd\":\"vantage points\"},{\"wd\":\"viewpoints\"}]],\"rel_list\":[[{\"wd\":\"interpretations\"},{\"wd\":\"spins\"}],[{\"wd\":\"beliefs\"},{\"wd\":\"convictions\"},{\"wd\":\"eyes\"},{\"wd\":\"feelings\"},{\"wd\":\"judgments\",\"wvrs\":[{\"wvl\":\"or\",\"wva\":\"judgements\"}]},{\"wd\":\"minds\"},{\"wd\":\"mind-sets\"},{\"wd\":\"notions\"},{\"wd\":\"opinions\"},{\"wd\":\"perceptions\"},{\"wd\":\"persuasions\"},{\"wd\":\"sentiments\"},{\"wd\":\"verdicts\"},{\"wd\":\"views\"}],[{\"wd\":\"impressions\"},{\"wd\":\"takes\"}]],\"phrase_list\":[[{\"wd\":\"frames of reference\"}]]}]]]}],\"shortdef\":[\"a way of looking at or thinking about something\"]},{\"meta\":{\"id\":\"point of view\",\"uuid\":\"8446791b-ce99-4c36-9afa-91520d426674\",\"src\":\"CTenhance\",\"section\":\"phrases\",\"stems\":[\"point of view\",\"points of view\"],\"syns\":[[\"angle\",\"eye view\",\"outlook\",\"perspective\",\"shoes\",\"slant\",\"standpoint\",\"vantage point\",\"viewpoint\"]],\"ants\":[],\"offensive\":false},\"hwi\":{\"hw\":\"point of view\"},\"fl\":\"phrase\",\"def\":[{\"sseq\":[[[\"sense\",{\"dt\":[[\"text\",\"a way of looking at or thinking about something \"],[\"vis\",[{\"t\":\"From my {it}point of view{\\/it}, the best decision is to quit while we\\u0027re ahead.\"}]]],\"syn_list\":[[{\"wd\":\"angle\"},{\"wd\":\"eye view\"},{\"wd\":\"outlook\"},{\"wd\":\"perspective\"},{\"wd\":\"shoes\"},{\"wd\":\"slant\"},{\"wd\":\"standpoint\"},{\"wd\":\"vantage point\"},{\"wd\":\"viewpoint\"}]],\"rel_list\":[[{\"wd\":\"interpretation\"},{\"wd\":\"spin\"}],[{\"wd\":\"belief\"},{\"wd\":\"conviction\"},{\"wd\":\"eye\"},{\"wd\":\"feeling\"},{\"wd\":\"judgment\",\"wvrs\":[{\"wvl\":\"or\",\"wva\":\"judgement\"}]},{\"wd\":\"mind\"},{\"wd\":\"mind-set\"},{\"wd\":\"notion\"},{\"wd\":\"opinion\"},{\"wd\":\"perception\"},{\"wd\":\"persuasion\"},{\"wd\":\"sentiment\"},{\"wd\":\"verdict\"},{\"wd\":\"view\"}],[{\"wd\":\"impression\"},{\"wd\":\"take\"}]],\"phrase_list\":[[{\"wd\":\"frame of reference\"}]]}]]]}],\"shortdef\":[\"a way of looking at or thinking about something\"]}]`;

test("parsing", async () => {
  const response = await MeriamParse(word, new Response(meriamMockResponse));
  expect(response.type).toBe("success");
  expect((response as any).data.length).toBeGreaterThan(0);
});

const API_KEY = ``;
const validDictionary = API_KEY ? BuildMeriam(API_KEY) : undefined;
const wrongKeyDictionary = BuildMeriam("1234");

test("successful fetch and parse", async () => {
  expect(validDictionary).toBeTruthy();

  const response = await validDictionary.GetSynonyms(word);

  expect(response.type).toBe("success");
  expect((response as any).data.length).toBeGreaterThan(0);
});

test("wrong key", async () => {
  const response = await wrongKeyDictionary.GetSynonyms("points_of_vew");
  expect(response.type).toBe("error");
  expect((response as any).errorMessage).toBe(APIErrorEnum.WrongAPIkey);
});

test("non existant word", async () => {
  expect(validDictionary).toBeTruthy();
  const response = await validDictionary.GetSynonyms("asfskjdfnskjdf");
  expect(response.type).toBe("error");
  expect((response as any).errorMessage).toBe(APIErrorEnum.NoWord);
});

test.skip("network unavailiable", async () => {
  const response = await wrongKeyDictionary.GetSynonyms(word);

  expect(response.type).toBe("error");
  expect((response as any).errorMessage).toBe(APIErrorEnum.Network);
});
