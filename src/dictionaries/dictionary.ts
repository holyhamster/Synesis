import AsyncStorage from "@react-native-async-storage/async-storage";
import Merriam from "./meriam/meriam";

import Keys from "./keys";
import { APIResponse } from "./apiResponse";

export default interface Dictionary {
  GetSynonyms: (string: string) => Promise<APIResponse>;
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

export async function SaveCurrentDictionaryType(
  type: DictionaryType,
  key?: string
) {
  const promises: Promise<void>[] = [];
  promises.push(AsyncStorage.setItem(apiNameKey, type));
  if (type != DictionaryType.Self && key) promises.push(Keys.Set(type, key));

  return Promise.all(promises);
}
