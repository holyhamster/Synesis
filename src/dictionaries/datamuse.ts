import { APIErrorEnum, APIResponse } from "./apiResponse";
import Dictionary, { Fetcher, Normalizer, Parser } from "./dictionary";

export default function BuildDatamuse(): Dictionary {
  return new Dictionary(
    new DatamuseFetcher(),
    new DatamuseParser(),
    new DatamuseNormalizer()
  );
}

export class DatamuseParser implements Parser {
  public ParseData(response: string): APIResponse {
    try {
      const parsed = JSON.parse(response);
      if (parsed.length == 0 || parsed[0]?.word == undefined)
        throw new Error(APIErrorEnum.NoWord);

      const sets: string[][] = parsed.map((definition) => [definition.word]);

      return { type: "success", data: [sets] };
    } catch (error) {
      return { type: "error", errorMessage: error.message };
    }
  }
}

export class DatamuseFetcher implements Fetcher {
  public async FetchData(word: string): Promise<string> {
    word.replace(" ", "_");
    const response = await fetch(
      `https://api.datamuse.com/words?rel_syn=${word}`
    );

    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);

    const text = await response.text();

    if (!text) throw new Error("Empty response");

    return text;
  }
}

export class DatamuseNormalizer implements Normalizer {
  public NormalizeWord(word: string): string {
    return word.replace(" ", "_");
  }
}
