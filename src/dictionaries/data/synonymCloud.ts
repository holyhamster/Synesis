import { SynonymDefinition, SynonymSet } from "./apiResponse";
import SynonymCollection from "./synonymCollection";
import WordNormal from "./wordNormal";

//Synonym word crossreferences with other words
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

export function Cross(collections: SynonymCollection[]): SynonymCloud[] {
  const map: Map<string, SynonymCloud> = new Map();
  // init a cloud for every word in collections and link it to its parent word
  for (const collection of collections)
    for (const definition of collection.dataSets)
      for (const synonymList of definition)
        for (const word of synonymList) {
          if (map.has(word)) continue;
          const entry = new SynonymCloud(word);
          entry.addConnection(collection.Word);
          map.set(word, entry);
        }

  for (let i = 0; i < collections.length; i++) {
    for (let j = i + 1; j < collections.length; j++) {
      for (const iDefinition of collections[i].dataSets) {
        for (const jDefinition of collections[j].dataSets) {
          weightDefinitions(
            map,
            collections[i].Word,
            iDefinition,
            collections[j].Word,
            jDefinition
          );
        }
      }
    }
  }

  collections.forEach((syns) => map.delete(syns.Word));
  return Array.from(map.values()).sort(function (a, b) {
    return a.sum - b.sum;
  });
}

function weightDefinitions(
  map: Map<string, SynonymCloud>,
  iWord: string,
  iDefinition: SynonymDefinition,
  jWord: string,
  jDefinition: SynonymDefinition
) {
  for (const iSynonymList of iDefinition) {
    if (iSynonymList.has(jWord)) {
      changeWeight(map, iDefinition, jWord);
      changeWeight(map, iSynonymList, jWord);
    }

    for (const jSynonymList of jDefinition) {
      if (jSynonymList.has(iWord)) {
        changeWeight(map, jDefinition, iWord);
        changeWeight(map, jSynonymList, iWord);
      }
      for (const word of iSynonymList) {
        if (jSynonymList.has(word)) {
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
  data: SynonymDefinition | SynonymSet,
  iWord: string
) {
  if (Array.isArray(data))
    data.forEach((elemet) => changeWeight(map, elemet, iWord));
  else data.forEach((word) => map.get(word)?.addConnection(iWord));
}

export function NormalizeWord(word: string) {
  return word
    .replace(/[^a-z0-9\s-]/gi, "")
    .trim()
    .toLowerCase();
}
