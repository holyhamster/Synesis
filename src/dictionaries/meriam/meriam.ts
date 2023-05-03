import SynDefinition from "../../synDefinition";
import Dictionary from "../dictionary";
import { MerriamFetcher } from "./meriamFetcher";
import { MerriamParser } from "./meriamParser";

export default class Merriam implements Dictionary {
  fetcher: MerriamFetcher;
  constructor(apiKey: string) {
    this.fetcher = new MerriamFetcher(apiKey);
  }

  GetSynonyms(word: string): Promise<string[][][]> {
    return this.fetcher
      .FetchData(word)
      .then((data) => MerriamParser.ParseData(data, word));
  }

  Check() {
    return true;
  }
}
