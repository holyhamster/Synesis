//A tree of synonyms for a word
export default class SynDefinition {
  public Color: string = "#7A7B7A";
  constructor(public Word: string) {}
  private sets: string[][] = [];
  get Sets(): string[][] {
    return this.sets;
  }
  set Sets(value: string[][]) {
    this.wasFetched = true;
    this.sets = value;
    this.isEmpty = this.sets.length == 0;
    this.Color = this.isEmpty ? "#63666A" : this.Color;
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

export function GetNextColor(synArray: SynDefinition[]): string {
  //TODO: make an array of premade colors, make this function pick a non-busy one
  let randomNumber = Math.floor(Math.random() * 16777216);
  let hexString = randomNumber.toString(16).padStart(6, "0");
  return "#" + hexString;
}

interface dataEntry {
  value: string;
  color: string;
  count: number;
}

/* Takes an array of SynDefinitions, returns a flat array of all synonyms in {value, color, count} format */
export function BuildData(syns: SynDefinition[]): dataEntry[] {
  const result: Map<string, dataEntry> = new Map();
  syns.forEach((synDef) => {
    synDef.Sets.forEach((setArray) => {
      setArray.forEach((synonym) => {
        let data = result.get(synonym);
        if (!data) {
          data = { value: synonym, color: synDef.Color, count: 1 };
          result.set(synonym, data);
        } else data.count += 1;
      });
    });
  });
  return Array.from(result.values());
}
