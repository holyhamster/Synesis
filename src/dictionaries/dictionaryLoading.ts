import BuildDatamuse from "./datamuse";
import BuildMeriam from "./meriam";
import Keys from "./keyHandling";
import Dictionary, {
  DictionaryKeyRequirement,
  DictionaryType,
} from "./dictionary";
import Storage from "./storageHandling";
import BuildBHL from "./bighugelabs";

//Getters and setters for dictionary information in local storage
export async function GetCurrentDictionary(): Promise<Dictionary> {
  const apiType = (await LoadCurrentDictionaryType()) || DictionaryType.Self;
  let key: string;

  if (DictionaryKeyRequirement[apiType]) key = await Keys.Get(apiType);
  switch (apiType) {
    case DictionaryType.Self:
      return buildDefaultDictionary();
    case DictionaryType.Meriam:
      return BuildMeriam(key);
    case DictionaryType.Datamuse:
      return BuildDatamuse();
    case DictionaryType.BigHugeThesarus:
      return BuildBHL(key);
  }
}

const apiNameKey = "current_api_name";

export async function LoadCurrentDictionaryType() {
  const result = await Storage.GetString(apiNameKey);
  return (result as DictionaryType) || DictionaryType.Self;
}

export async function SaveCurrentDictionaryType(
  type: DictionaryType,
  key?: string
) {
  const promises: Promise<void>[] = [];
  promises.push(Storage.SetString(apiNameKey, type));
  if (type != DictionaryType.Self && key) promises.push(Keys.Set(type, key));

  return Promise.all(promises);
}

const buildDefaultDictionary = BuildDatamuse;
