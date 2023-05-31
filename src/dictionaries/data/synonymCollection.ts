import { DisabledGrey, getFreeColor } from "../../colors";
import { APIReturnData } from "./apiResponse";
import Dictionary from "../dictionary";

//Synonym word with fetched api data
export default class SynonymCollection {
  public Word: string;
  constructor(word: string, takenColors: string[] = []) {
    this.Word = NormalizeWord(word);
    this.color = getFreeColor(takenColors);
  }

  public dataSets: APIReturnData = [];
  private set(value: APIReturnData) {
    this.wasFetched = true;
    this.dataSets = value;
    this.isEmpty = this.dataSets.length == 0;
  }

  private color: string;
  public get Color(): string {
    return this.IsEmpty ? DisabledGrey : this.color;
  }

  public async Load(
    dictionary: Dictionary,
    onSuccess = () => {},
    onError = (error: string) => {}
  ) {
    const response = await dictionary.GetSynonyms(this.Word);
    if (response.type == "success") {
      this.set(response.data);
      onSuccess();
    } else {
      this.set([]);
      onError(response.errorMessage);
    }
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
