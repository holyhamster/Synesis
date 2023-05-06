import AsyncStorage from "@react-native-async-storage/async-storage";
import Merriam from "./meriam/meriam";

import Keys from "../keys";

export default interface Dictionary {
  GetSynonyms: (string: string) => Promise<string[][][]>;
  Check: () => boolean;
}

export enum DictionaryType {
  Self = "Default",
  Meriam = "MeriamWebster",
}

export async function GetCurrentDictionary(): Promise<Dictionary> {
  const apiType = (await LoadCurrentDictionaryType()) || DictionaryType.Self;

  const key =
    apiType == DictionaryType.Self
      ? process.env.REACT_APP_API_KEY
      : await Keys.Get(apiType);
  switch (apiType) {
    default:
      return new Merriam(key);
  }
}

const apiNameKey = "current_api_name";
export async function LoadCurrentDictionaryType() {
  const result = await AsyncStorage.getItem(apiNameKey);
  return (result as DictionaryType) || DictionaryType.Self;
}

export function SaveCurrentDictionaryType(type: DictionaryType, key?: string) {
  AsyncStorage.setItem(apiNameKey, type);

  if (type == DictionaryType.Self) return;
  if (key) Keys.Set(type, key);
}
