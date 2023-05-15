// [{word:"vague", value:.5}, {word:"undefined", value:.5}]
export default class WordNormal extends Array<{ word: string; value: number }> {
  constructor(copy?: WordNormal) {
    super(...Array.from(copy || []));
  }
}
