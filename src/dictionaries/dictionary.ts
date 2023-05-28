import { APIResponse } from "./data/apiResponse";

//fetches information about a word from an API and parses it into a synonym
export default class Dictionary {
  constructor(
    private fetcher: Fetcher,
    private parser: Parser,
    private normalizer?: Normalizer
  ) {}

  GetSynonyms(word: string) {
    word = this.normalizer ? this.normalizer.NormalizeWord(word) : word;
    return this.fetcher.FetchData(word).then((data) => {
      return this.parser.ParseData(data, word);
    });
  }
}

export interface Fetcher {
  FetchData(word: string): Promise<string>;
}

export interface Parser {
  ParseData(response: string, targetWord: string): APIResponse;
}

export interface Normalizer {
  NormalizeWord(word: string): string;
}

export enum DictionaryType {
  Self = "Default",
  Meriam = "MeriamWebster",
  Datamuse = "Datamuse",
}

export const DictionaryKeyRequirement = {
  [DictionaryType.Self]: false,
  [DictionaryType.Meriam]: true,
  [DictionaryType.Datamuse]: false,
};
