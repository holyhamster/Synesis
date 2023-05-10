import AsyncStorage from "@react-native-async-storage/async-storage";

export async function GetString(storageString: string) {
  return AsyncStorage.getItem(storageString);
}

export async function SetString(storageString: string, value: string) {
  return AsyncStorage.setItem(storageString, value);
}

export enum StringTypesEnum {
  WasLaunched = "WasLaunched",
}
