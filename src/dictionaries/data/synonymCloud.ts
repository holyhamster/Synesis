import SynonymCollection from "./synonymCollection";
import WordNormal, { CalculateWeights } from "./wordNormal";

//a word with connection values to other words
export default class SynonymCloud {
  //a map of connections to other words
  //connections are stored as an array of numbers,  the lower the index the more important the connection is
  connections = new Map<string, number[]>();
  connectionSum = []; //sums of connections of all words, stored in parallel for performance
  public constructor(public name: string) {}

  public addConnection(word: string, order: number, strength = 1) {
    this.nullCache();
    const existingDimensions = this.connections.get(word) || [];
    if (existingDimensions.length == 0)
      this.connections.set(word, existingDimensions);
    existingDimensions[order] = (existingDimensions[order] || 0) + strength;
    while (this.connectionSum.length <= order) this.connectionSum.push(0);
    this.connectionSum[order] += strength;
  }

  private nullCache() {
    this.normalCache = undefined;
    this.wordMapCache = undefined;
  }

  //gets a map of a normalized n-dimensional vector of connections ["word1": 0.25, "word2": 0.5, "word3": 0.25]
  private normalCache: WordNormal;
  public GetWordNormal() {
    if (!this.normalCache)
      this.normalCache = buildWordNormal(this.connections, this.connectionSum);
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

  //sorts cloud array by connection strength to a certain word
  public static GetSorted(clouds: SynonymCloud[], word: string) {
    const result = Array.from(clouds);
    if (!word || word == "") return result;
    result.sort(
      (a, b) =>
        (b.GetWordMap().get(word) || 0) - (a.GetWordMap().get(word) || 0)
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
      if (!allKeywords.includes(setWord))
        getCloud(setWord).addConnection(keyWord, order);
    }
  };

  //compare collections between each other, adding connections to all matching words
  for (const collection of collections)
    for (const definition of collection.definitionSets)
      for (const synonymSet of definition)
        for (const word of synonymSet) {
          //if found a word from main list
          if (allKeywords.includes(word)) {
            //go through synonym list, add 1st degree connection
            addConnectionToSet(synonymSet, word, 1);

            for (const synonymList2 of definition)
              if (synonymList2 !== synonymSet)
                addConnectionToSet(synonymList2, word, 2);
          } else getCloud(word).addConnection(collection.Word, 0);
        }

  return map;
}

function buildWordNormal(connections: Map<string, number[]>, sum: number[]) {
  const normal = new WordNormal();
  const connectionWeights = CalculateWeights(sum);

  for (const [word, mentions] of connections) {
    let val = 0;
    for (let i = 0; i < mentions.length; i++)
      val += connectionWeights[i] * mentions[i] || 0;

    normal.push({
      word: word,
      value: parseFloat(val.toFixed(5)),
    });
  }

  return normal;
}
