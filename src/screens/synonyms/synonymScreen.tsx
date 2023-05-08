import { StatusBar } from "expo-status-bar";
import React, { FC, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  ToastAndroid,
  View,
  ScrollView,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Text,
  DeviceEventEmitter,
} from "react-native";

import WordInputField from "./wordInputField";
import SynonymListView from "./synonymListView";
import SynDefinition, { BuildPlus } from "../../synDefinition";
import DataEntry from "./dataEntry";
import Dictionary from "../../dictionaries/dictionary";
import { HomeProps } from "../../navigation";
import { EventsEnum } from "../../events";
import { GetCurrentDictionary } from "../../dictionaries/dictionaryStorage";

const SynonymScreen: FC<HomeProps> = ({ navigation }) => {
  const [synArray, setSynArray] = React.useState<SynDefinition[]>([]);

  //instance of API dictionary, update existing synonym list if API changes
  const [currentDict, setCurrentDict] = React.useState<Dictionary>();
  useEffect(() => {
    synArray.forEach((syn) => loadSyn(syn));
  }, [currentDict]);

  //load default dictionary on loading component, add listener to changeApi event
  useEffect(() => {
    GetCurrentDictionary().then((dict) => setCurrentDict(dict));
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.ApiChanged,
      () => GetCurrentDictionary().then((dict) => setCurrentDict(dict))
    );
    return () => subscription.remove();
  }, []);

  //entries are an array of prepared data for synonym list, updaded when synArray states change
  const [entries, setEntries] = React.useState<DataEntry[]>([]);
  useEffect(() => setEntries(BuildPlus(synArray)), [synArray]);

  const getSyn = (word: string) => {
    const newSyn = new SynDefinition(
      word,
      synArray.map((syn) => syn.Color)
    );
    if (
      newSyn.Word == "" ||
      synArray.findIndex((definiton) => definiton.Word == newSyn.Word) >= 0
    )
      return undefined;
    return newSyn;
  };

  const loadSyn = (syn: SynDefinition) => {
    const onSucces = () => {
      setSynArray((previous) => Array.from(previous));
    };

    const onFail = (message) => {
      ToastAndroid.show(message, ToastAndroid.LONG);
      setSynArray((previous) => Array.from(previous));
    };

    syn.Load(currentDict, onSucces, onFail);
  };

  const addWord = async (word: string) => {
    const newSyn = getSyn(word);
    if (!newSyn) return;
    setSynArray((previous) => [...previous, newSyn]);
    loadSyn(newSyn);
  };

  const removeWord = (Word: string) => {
    const index = synArray.findIndex((synDef) => synDef.Word == Word);
    if (index < 0) return;
    setSynArray([...synArray.slice(0, index), ...synArray.slice(index + 1)]);
  };

  const inputRef = React.useRef<TextInput>();

  const synonymList =
    synArray.length == 0 ? (
      <TouchableOpacity onPress={() => inputRef.current.focus()}>
        <Text>Enter a word to get synonyms!</Text>
      </TouchableOpacity>
    ) : (
      <ScrollView
        style={{ flex: 1 }}
        fadingEdgeLength={1}
        invertStickyHeaders={true}
        contentContainerStyle={{ paddingVertical: 100 }}
      >
        <SynonymListView entries={entries} addWord={addWord} />
      </ScrollView>
    );

  const selectedContainer = (
    <View style={styles.selectedContainer}>
      <View style={styles.selectedList}>
        {synArray.map((synDef, index) => (
          <Button
            key={index}
            title={synDef.Word}
            color={synDef.Color}
            onPress={() => removeWord(synDef.Word)}
          />
        ))}
      </View>
      <View style={styles.selectedClearButton}>
        <TouchableOpacity
          onPress={() => {
            setSynArray([]);
          }}
          disabled={synArray.length == 0}
        >
          <View style={{ alignItems: "center" }}>
            <MaterialIcons name="clear" size={32} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.synonyms}>{synonymList}</View>

      <View style={styles.menuButton}>
        <Button
          title={"Options"}
          onPress={() => navigation.navigate("Options")}
        ></Button>
      </View>

      <View style={styles.connectionIndicator}>
        <ActivityIndicator
          animating={synArray.find((synDef) => !synDef.WasFetched) != null}
          size="large"
        />
      </View>

      {selectedContainer}

      <View style={styles.inputContainer}>
        <WordInputField inputRef={inputRef} onAddWord={addWord} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  connectionIndicator: {
    position: "absolute",
    left: 10,
    top: 40,
    width: 50,
    height: 50,
    zIndex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
  },

  inputContainer: {
    backgroundColor: "pink",
    marginVertical: 10,
    flexDirection: "row",
  },

  menuButton: {
    position: "absolute",
    right: 10,
    top: 40,
    backgroundColor: "green",
    zIndex: 1,
  },

  selectedContainer: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "orange",
  },

  selectedClearButton: {
    flex: 1,
    backgroundColor: "yellow",
  },

  selectedList: {
    flex: 4,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    alignSelf: "stretch",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    gap: 5,
    backgroundColor: "yellow",
  },

  synonyms: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default SynonymScreen;
