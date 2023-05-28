//normal vector of synonyms for a word
// [{word:"vague", value:.5}, {word:"undefined", value:.3}, {word:"inaccurate", value: .2}]
export default class WordNormal extends Array<{ word: string; value: number }> {
  constructor(copy?: WordNormal) {
    super(...Array.from(copy || []));
  }
}
