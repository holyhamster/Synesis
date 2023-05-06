import * as SecureStore from "expo-secure-store";
import { DictionaryType } from "./dictionaries/dictionary";

//securely handles setting and getting of api keys
export default class Keys {
  static Set(keyType: DictionaryType, key: string) {
    SecureStore.setItemAsync(secureKeyName(keyType), key);
  }

  static async Get(keyType: DictionaryType) {
    return SecureStore.getItemAsync(secureKeyName(keyType));
  }
}
const secureKeyName = (type: string) => "key-" + type;
