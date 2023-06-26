import { APIErrorEnum, APIResponse } from "./data/apiResponse";

//fetches information about a word from an API and parses it into a synonym
export default class Dictionary {
  constructor(
    private urlGetter: getURL,
    private parse: parseResponse,
    private normalize?: normalizeWord
  ) {}
  private fetchResponse(word: string) {
    return fetch(this.urlGetter(word));
  }

  GetSynonyms(word: string) {
    word = this.normalize ? this.normalize(word) : word;

    return this.fetchResponse(word)
      .then((response) => this.parse(word, response))
      .catch(
        (_) =>
          ({ type: "error", errorMessage: APIErrorEnum.Network } as APIResponse)
      );
  }
}

type getURL = (word: string, apiKey?: string) => string;
type parseResponse = (word: string, response: Response) => Promise<APIResponse>;
type normalizeWord = (string: string) => string;

export enum DictionaryType {
  Self = "Default",
  Meriam = "MeriamWebster",
  Datamuse = "Datamuse",
  BigHugeThesarus = "BigHugeThesarus",
}

export const DictionaryKeyRequirement = {
  [DictionaryType.Self]: false,
  [DictionaryType.Meriam]: true,
  [DictionaryType.BigHugeThesarus]: true,
  [DictionaryType.Datamuse]: false,
};

export const DictionaryRegistrationLinks = {
  [DictionaryType.Self]: "",
  [DictionaryType.Meriam]: "https://dictionaryapi.com/",
  [DictionaryType.BigHugeThesarus]:
    "https://words.bighugelabs.com/account/getkey",
  [DictionaryType.Datamuse]: "",
};
