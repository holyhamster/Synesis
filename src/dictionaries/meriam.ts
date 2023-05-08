import { APIErrorEnum, APIResponse } from "./apiResponse";
import Dictionary, { Fetcher, Parser } from "./dictionary";

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
      const sets: string[][][] = [];
      if (parsed.length == 0 || parsed[0].meta == undefined)
        throw new Error(APIErrorEnum.NoWord);
      parsed
        .filter((element) => element.meta.id == targetWord)
        .forEach((def) => {
          const array: string[][] = [];
          def.meta.syns
            .filter((synonymList: string[]) => synonymList.length > 0)
            .forEach((synonymList: string[]) =>
              array.push(Array.from(synonymList))
            );
          sets.push(array);
        });
      return { type: "success", data: sets };
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
