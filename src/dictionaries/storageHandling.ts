import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Storage {
  static async GetString(storageString: string) {
    return AsyncStorage.getItem(storageString);
  }

  static async SetString(storageString: string, value: string) {
    return AsyncStorage.setItem(storageString, value);
  }
}

export enum StringTypesEnum {
  WasLaunched = "WasLaunched",
  DisabledVisualts = "DisabledVisuals",
  TileLayout = "TileLayout",
  TileCount = "TileCount",
}
