import SynonymCollection from "./synonymCollection";
import WordNormal, { CalculateWeights } from "./wordNormal";

//Synonym word crossreferences with other words
export default class SynonymCloud {
  connections = new Map<string, number[]>();
  connectionSum = []; //calculated in parallel for performance
  public constructor(public name: string) {}

  public addConnection(word: string, order: number) {
    this.nullCache();
    const existingDimensions = this.connections.get(word) || [];
    if (existingDimensions.length == 0)
      this.connections.set(word, existingDimensions);
    existingDimensions[order] = (existingDimensions[order] || 0) + 1;
    while (this.connectionSum.length <= order) this.connectionSum.push(0);
    this.connectionSum[order] += 1;
  }

  private nullCache() {
    this.normalCache = undefined;
    this.wordMapCache = undefined;
  }

  //gets a map of a normalized n-dimensional vector of connections ["word1": 0.25, "word2": 0.5, "word3": 0.25]
  private normalCache: WordNormal;
  public GetWordNormal() {
    if (!this.normalCache)
      this.normalCache = WordNormal.Build(this.connections, this.connectionSum);
    return WordNormal.Copy(this.normalCache);
  }

  //translates word normal into a map
  private wordMapCache;
  public GetWordMap() {
    if (!this.wordMapCache) {
      this.wordMapCache = new Map();
      this.GetWordNormal().forEach(({ word, value }) =>
        this.wordMapCache.set(word, value)
      );
    }
    return this.wordMapCache;
  }

  public static GetSorted(clouds: SynonymCloud[], word: string) {
    const result = Array.from(clouds);
    if (!word || word == "") return result;
    result.sort(
      (a, b) =>
        (a.GetWordMap().get(word) || 0) - (b.GetWordMap().get(word) || 0)
    );
    return result;
  }
}

//build clouds of synonyms from given collections
export function CrossReference(collections: SynonymCollection[]) {
  const allKeywords = collections.map(
    (synonymCollection) => synonymCollection.Word
  );

  const map = new Map<string, SynonymCloud>();

  const getCloud = (word) => {
    let cloud = map.get(word);
    if (!cloud) {
      cloud = new SynonymCloud(word);
      map.set(word, cloud);
    }
    return cloud;
  };

  const addConnectionToSet = (
    set: Set<string>,
    keyWord: string,
    order: number
  ) => {
    for (const setWord of set) {
      if (allKeywords.includes(setWord)) continue;
      getCloud(setWord).addConnection(keyWord, order);
    }
  };

  for (const collection of collections)
    for (const definition of collection.definitionSets)
      for (const synonymSet of definition)
        for (const word of synonymSet) {
          //if found a word from main list
          if (allKeywords.includes(word)) {
            //go through synonym list, add 1st degree connection
            addConnectionToSet(synonymSet, word, 1);

            for (const synonymList2 of definition) {
              if (synonymList2 === synonymSet) continue;
              addConnectionToSet(synonymList2, word, 2);
            }
          } else {
            getCloud(word).addConnection(collection.Word, 0);
          }
        }

  return Array.from(map.values());
}
