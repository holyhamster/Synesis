import { APIReturnData } from "./apiResponse";
import Dictionary from "../dictionary";

//Synonym word with fetched api data
export default class SynonymCollection {
  public Word: string;
  constructor(word: string) {
    this.Word = NormalizeWord(word);
  }

  public definitionSets: APIReturnData = [];
  private set(value: APIReturnData) {
    this.wasFetched = true;
    this.definitionSets = value;
    this.isEmpty = this.definitionSets.length == 0;
  }

  public async Load(dictionary: Dictionary) {
    const response = await dictionary.GetSynonyms(this.Word);
    const data = response.type == "success" ? response.data : [];
    this.set(data);
    return response;
  }

  private isEmpty: boolean = false;
  get IsEmpty(): boolean {
    return this.isEmpty;
  }

  private wasFetched: boolean = false;
  get WasFetched(): boolean {
    return this.wasFetched;
  }
}

export function NormalizeWord(word: string) {
  return word
    .replace(/[^a-z0-9\s-]/gi, "")
    .trim()
    .toLowerCase();
}
