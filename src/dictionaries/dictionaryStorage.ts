import BuildDatamuse from "./datamuse";
import BuildMeriam from "./meriam";
import Keys from "./keys";
import Dictionary, {
  DictionaryKeyRequirement,
  DictionaryType,
} from "./dictionary";
import { GetString, SetString } from "./storage";

//Getters and setters for dictionary information in local storage

export async function GetCurrentDictionary(): Promise<Dictionary> {
  const apiType = (await LoadCurrentDictionaryType()) || DictionaryType.Self;
  let key;

  if (apiType == DictionaryType.Self) key = process.env.REACT_APP_API_KEY;
  else if (DictionaryKeyRequirement[apiType]) key = await Keys.Get(apiType);

  switch (apiType) {
    case DictionaryType.Self:
      return BuildMeriam(key);
    case DictionaryType.Meriam:
      return BuildMeriam(key);
    case DictionaryType.Datamuse:
      return BuildDatamuse();
  }
}

const apiNameKey = "current_api_name";
export async function LoadCurrentDictionaryType() {
  const result = await GetString(apiNameKey);
  return (result as DictionaryType) || DictionaryType.Self;
}

export async function SaveCurrentDictionaryType(
  type: DictionaryType,
  key?: string
) {
  const promises: Promise<void>[] = [];
  promises.push(SetString(apiNameKey, type));
  if (type != DictionaryType.Self && key) promises.push(Keys.Set(type, key));

  return Promise.all(promises);
}
