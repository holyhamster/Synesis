export class MerriamFetcher {
  constructor(private apiKey: string) {}

  public async FetchData(word: string): Promise<string> {
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${this.apiKey}`
    );

    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);

    const text = await response.text();

    if (!text) throw new Error("Empty response");

    return text;
  }
}
