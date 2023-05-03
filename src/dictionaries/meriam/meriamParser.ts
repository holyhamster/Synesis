import SynDefinition from "../../synDefinition";

export class MerriamParser {
  public static ParseData(response: string, targetWord: string): string[][][] {
    try {
      const parsed = JSON.parse(response);

      const sets: string[][][] = [];
      if (parsed.length == 0 || parsed[0].meta == undefined)
        throw new Error("no word in the database");
      parsed
        .filter((element) => element.meta.id == targetWord)
        .forEach((def) => {
          const array: string[][] = [];
          def.meta.syns
            .filter((synonymList: string[]) => synonymList.length > 0)
            .forEach((synonymList: string[]) =>
              array.push(Array.from(synonymList))
            );
          sets.push(array);
        });

      return sets;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
