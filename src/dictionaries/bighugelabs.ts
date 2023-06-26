import {
  APIReturnData,
  APIErrorEnum,
  APIResponse,
  SynonymDefinition,
} from "./data/apiResponse";
import Dictionary from "./dictionary";

//dictionary components for MeriamWebster api
export default function BuildBHL(apiKey: string): Dictionary {
  return new Dictionary(
    (word: string) =>
      `https://words.bighugelabs.com/api/2/${apiKey}/${word}/json`,
    BHLParse
  );
}

const allowedTypes = ["syn", "sim"];
export async function BHLParse(
  targetWord: string,
  response: Response
): Promise<APIResponse> {
  try {
    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);
    const text = await response.text();
    if (!text) throw new Error(`empty response`);

    const parsed = JSON.parse(text);
    const set: Set<string> = new Set();
    for (const wordType in parsed) {
      for (const relType in parsed[wordType]) {
        if (allowedTypes.includes(relType)) {
          Array.from(parsed[wordType][relType]).forEach((word: string) =>
            set.add(word)
          );
        }
      }
    }
    return { type: "success", data: [[set]] };
  } catch (error) {
    return { type: "error", errorMessage: error.message };
  }
}
