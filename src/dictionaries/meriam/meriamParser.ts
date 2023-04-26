import SynDefinition from "../../synDefinition";

export class MerriamParser {
  public static ParseData(response: string, targetWord: string): SynDefinition {
    try {
      const parsed = JSON.parse(response);

      const sets: string[][] = [];
      if (parsed.length == 0 || parsed[0].meta == undefined)
        throw new Error("no word in the database");
      parsed
        .filter((element) => element.meta.id == targetWord)
        .forEach((def) => {
          const array: string[] = [];
          def.meta.syns.forEach((synonymList) =>
            synonymList.forEach((synonym) => array.push(synonym))
          );
          if (array.length > 0) sets.push(array);
        });

      const result = new SynDefinition(targetWord);
      result.Sets = sets;
      return result;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
