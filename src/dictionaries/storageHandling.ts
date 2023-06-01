import AsyncStorage from "@react-native-async-storage/async-storage";

export async function GetStringFromStorage(storageString: string) {
  return AsyncStorage.getItem(storageString);
}

export async function SetStringInStorage(storageString: string, value: string) {
  return AsyncStorage.setItem(storageString, value);
}

export enum StringTypesEnum {
  WasLaunched = "WasLaunched",
  DisabledVisulats = "DisabledVisulats",
  TileLayout = "TileLayout",
}
