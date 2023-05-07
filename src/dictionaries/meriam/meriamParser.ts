import { APIResponse, APIErrorEnum } from "../apiResponse";

export class MerriamParser {
  public static ParseData(response: string, targetWord: string): APIResponse {
    if (detectWrongKey(response))
      return {
        type: "error",
        errorMessage: APIErrorEnum.WrongAPIkey,
      };

    try {
      const parsed = JSON.parse(response);

      const sets: string[][][] = [];
      if (parsed.length == 0 || parsed[0].meta == undefined)
        throw new Error(APIErrorEnum.NoWord);
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

      return { type: "success", data: sets };
    } catch (error) {
      return { type: "error", errorMessage: error.message };
    }
  }
}

function detectWrongKey(response: string): boolean {
  return response === "Invalid API key. Not subscribed for this reference.";
}
