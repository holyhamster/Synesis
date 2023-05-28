import SynonymCollection from "./synonymCollection";
import WordNormal from "./wordNormal";

//single word in a synonym cloud
export default class SynonymCloud {
  connections: Map<string, number> = new Map();
  sum: number = 0;
  public constructor(public name: string) {}

  public addConnection(word: string, strength: number = 1) {
    this.sum += strength;
    const connection = this.connections.get(word) | 0;
    this.connections.set(word, connection + strength);
    this.vectorCache = undefined;
  }

  //gets a map of a normalized n-dimensional vector of connections ["word1": 0.25, "word2": 0.5, "word3": 0.25]
  private vectorCache: WordNormal;
  public GetWordNormal() {
    if (!this.vectorCache) {
      this.vectorCache = new WordNormal();
      this.connections.forEach((val, key) =>
        this.vectorCache.push({
          word: key,
          value: parseFloat((val / this.sum).toFixed(5)),
        })
      );
    }
    return new WordNormal(this.vectorCache);
  }
}

export function Cross(syns: SynonymCollection[]): SynonymCloud[] {
  const map: Map<string, SynonymCloud> = new Map();

  // make a flat array with all synonyms minus exceptions,
  for (const syn of syns) {
    for (const definition of syn.sets) {
      for (const synonymList of definition) {
        for (const word of synonymList) {
          if (map.has(word)) continue;
          const entry = new SynonymCloud(word);
          entry.addConnection(syn.Word);
          map.set(word, entry);
        }
      }
    }
  }

  for (let i = 0; i < syns.length; i++) {
    for (let j = i + 1; j < syns.length; j++) {
      for (const iDefinition of syns[i].sets) {
        for (const jDefinition of syns[j].sets) {
          weightDefinitions(
            map,
            syns[i].Word,
            iDefinition,
            syns[j].Word,
            jDefinition
          );
        }
      }
    }
  }

  syns.forEach((syns) => map.delete(syns.Word));
  return Array.from(map.values()).sort(function (a, b) {
    return a.sum - b.sum;
  });
}

function weightDefinitions(
  map: Map<string, SynonymCloud>,
  iWord: string,
  iDefinition: string[][],
  jWord: string,
  jDefinition: string[][]
) {
  for (let iSynonymList of iDefinition) {
    if (iSynonymList.includes(jWord)) {
      changeWeight(map, iDefinition, jWord);
      changeWeight(map, iSynonymList, jWord);
    }

    for (let jSynonymList of jDefinition) {
      if (jSynonymList.includes(iWord)) {
        changeWeight(map, jDefinition, iWord);
        changeWeight(map, jSynonymList, iWord);
      }
      for (let word of iSynonymList) {
        if (jSynonymList.includes(word)) {
          changeWeight(map, iDefinition, jWord);
          changeWeight(map, iSynonymList, jWord);
          changeWeight(map, jDefinition, iWord);
          changeWeight(map, jSynonymList, iWord);
        }
      }
    }
  }
}

function changeWeight(
  map: Map<string, SynonymCloud>,
  array: any[],
  iWord: string
) {
  const flat: string[] = array.flat(4);
  flat.forEach((word) => {
    map.get(word)?.addConnection(iWord);
  });
}

export function NormalizeWord(word: string) {
  return word
    .replace(/[^a-z0-9\s-]/gi, "")
    .trim()
    .toLowerCase();
}
