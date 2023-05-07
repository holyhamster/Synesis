import { EmptyColor, SynDefColor, getFreeColor } from "./colors";
import DataEntry from "./screens/synonyms/dataEntry";
import Dictionary from "./dictionaries/dictionary";

//A tree of synonyms for a word
export default class SynDefinition {
  public Word: string;
  constructor(word: string, takenColors: SynDefColor[] = []) {
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

  private color: SynDefColor;
  public get Color(): SynDefColor {
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

export function BuildPlus(syns: SynDefinition[]): DataEntry[] {
  const result: Map<string, DataEntry> = new Map();

  // make a flat array with all synonyms minus exceptions,
  for (let syn of syns) {
    for (let definition of syn.sets) {
      for (let synonymList of definition) {
        for (let word of synonymList) {
          if (result.has(word)) continue;
          result.set(word, {
            value: word,
            count: 1,
            color: syn.Color,
          } as DataEntry);
        }
      }
    }
  }

  for (let i = 0; i < syns.length; i++) {
    for (let j = i + 1; j < syns.length; j++) {
      for (let iDefinition of syns[i].sets) {
        for (let jDefinition of syns[j].sets) {
          weightDefinitions(
            result,
            syns[i].Word,
            iDefinition,
            syns[j].Word,
            jDefinition
          );
        }
      }
    }
  }

  syns.forEach((syns) => result.delete(syns.Word));
  return Array.from(result.values()).sort(function (a, b) {
    return a.count - b.count;
  });
}

function weightDefinitions(
  map: Map<string, DataEntry>,
  iWord: string,
  iDefinition: string[][],
  jWord: string,
  jDefinition: string[][]
) {
  for (let iSynonymList of iDefinition) {
    if (iSynonymList.includes(jWord)) {
      changeWeight(map, iDefinition, 1);
      changeWeight(map, iSynonymList, 1);
    }

    for (let jSynonymList of jDefinition) {
      if (jSynonymList.includes(iWord)) {
        changeWeight(map, jDefinition, 1);
        changeWeight(map, jSynonymList, 1);
      }
      for (let word of iSynonymList) {
        if (jSynonymList.includes(word)) {
          changeWeight(map, iDefinition, 1);
          changeWeight(map, jDefinition, 1);
          changeWeight(map, iSynonymList, 1);
          changeWeight(map, jSynonymList, 1);
        }
      }
    }
  }
}
function changeWeight(
  map: Map<string, DataEntry>,
  array: any[],
  change: number
) {
  const flat: string[] = array.flat(4);
  flat.forEach((word) => {
    if (map.has(word)) map.get(word).count += change;
  });
}

export function NormalizeWord(word: string) {
  return word.replace(/[^a-z0-9\s-]/gi, "").trim();
}
