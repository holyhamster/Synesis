import { APIErrorEnum, APIResponse } from "./data/apiResponse";
import Dictionary from "./dictionary";

//dictionary components for datamuse.com API
export default function BuildDatamuse(): Dictionary {
  return new Dictionary(
    (word: string) => `https://api.datamuse.com/words?rel_syn=${word}`,
    DatamuseParse,
    (word: string) => word.replace(" ", "_")
  );
}

export async function DatamuseParse(
  _: string,
  response: Response
): Promise<APIResponse> {
  try {
    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);

    const text = await response.text();
    if (!text) throw new Error("Empty response");
    const parsed = JSON.parse(text);
    if (parsed.length == 0 || parsed[0]?.word == undefined)
      throw new Error(APIErrorEnum.NoWord);

    const sets: Set<string>[] = parsed.map(
      (definition) => new Set<string>([definition.word])
    );

    return { type: "success", data: [sets] };
  } catch (error) {
    return { type: "error", errorMessage: error.message };
  }
}
