import * as SecureStore from "expo-secure-store";
import { DictionaryType } from "./dictionary";
import { Platform } from "react-native";
import Storage from "./storageHandling";

//securely handles setting and getting api keys (mobile only)
export default class Keys {
  static Set(keyType: DictionaryType, key: string) {
    const varName = secureKeyName(keyType);
    if (Platform.OS == "web") return Storage.SetString(varName, key);
    return SecureStore.setItemAsync(varName, key);
  }

  static async Get(keyType: DictionaryType) {
    const varName = secureKeyName(keyType);
    if (Platform.OS == "web") return Storage.GetString(varName);
    return SecureStore.getItemAsync(varName);
  }
}
const secureKeyName = (type: string) => "key-" + type;
