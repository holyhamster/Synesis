import { EmptyColor, getFreeColor } from "../../../colors";
import Dictionary from "../../../dictionaries/dictionary";

//A tree of synonyms for a word
export default class SynDefinition {
  public Word: string;
  constructor(word: string, takenColors: string[] = []) {
    this.Word = NormalizeWord(word);
    this.color = getFreeColor(takenColors);
  }

  private total: string[] = [];

  public sets: string[][][] = [];
  private set(value: string[][][]) {
    this.total = this.sets.flat(3);
    this.wasFetched = true;
    this.sets = value;
    this.isEmpty = this.sets.length == 0;
  }

  private color: string;
  public get Color(): string {
    return this.IsEmpty ? EmptyColor : this.color;
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
