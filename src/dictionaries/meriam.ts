import {
  APIReturnData,
  APIErrorEnum,
  APIResponse,
  SynonymDefinition,
} from "./data/apiResponse";
import Dictionary from "./dictionary";

//dictionary components for MeriamWebster api
export default function BuildMeriam(apiKey: string): Dictionary {
  return new Dictionary(
    (word: string) =>
      `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${apiKey}`,
    MeriamParse
  );
}

export async function MeriamParse(
  targetWord: string,
  response: Response
): Promise<APIResponse> {
  try {
    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);

    const text = await response.text();
    if (!text) throw new Error("Empty response");
    if (text.includes("Invalid API key"))
      return {
        type: "error",
        errorMessage: APIErrorEnum.WrongAPIkey,
      };

    const parsed = JSON.parse(text);
    const data: APIReturnData = [];
    if (parsed.length == 0 || parsed[0].meta == undefined)
      throw new Error(APIErrorEnum.NoWord);
    parsed
      .filter((collection) => collection.meta.id == targetWord)
      .forEach((definitionJSON) => {
        const definition: SynonymDefinition = [];
        definitionJSON.meta.syns.forEach((synonymList: string[]) => {
          if (synonymList?.length > 0) definition.push(new Set(synonymList));
        });
        data.push(definition);
      });
    return { type: "success", data: data };
  } catch (error) {
    return { type: "error", errorMessage: error.message };
  }
}
