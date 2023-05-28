import {
  APIReturnData,
  APIErrorEnum,
  APIResponse,
  SynonymDefinition,
} from "./data/apiResponse";
import Dictionary, { Fetcher, Parser } from "./dictionary";

//dictionary components for MeriamWebster api
export default function BuildMeriam(apiKey: string): Dictionary {
  return new Dictionary(new MeriamFetcher(apiKey), new MeriamParser());
}

export class MeriamParser implements Parser {
  public ParseData(response: string, targetWord: string): APIResponse {
    if (detectWrongKey(response))
      return {
        type: "error",
        errorMessage: APIErrorEnum.WrongAPIkey,
      };

    try {
      const parsed = JSON.parse(response);
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
}

export class MeriamFetcher implements Fetcher {
  constructor(private apiKey: string) {}
  public async FetchData(word: string): Promise<string> {
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${this.apiKey}`
    );

    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);

    const text = await response.text();

    if (!text) throw new Error("Empty response");

    return text;
  }
}

function detectWrongKey(response: string): boolean {
  return response === "Invalid API key. Not subscribed for this reference.";
}
