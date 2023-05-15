import { StatusBar } from "expo-status-bar";
import React, { FC, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  ToastAndroid,
  View,
  ScrollView,
  Button,
  ActivityIndicator,
  TextInput,
  DeviceEventEmitter,
} from "react-native";

import WordInputField from "./wordInputField";
import SynonymListView from "./synonymListView";
import SynDefinition from "./data/synDefinition";
import DataEntryClass, { Cross } from "./data/dataEntry";
import Dictionary from "../../dictionaries/dictionary";
import { HomeProps } from "../../navigation";
import { EventsEnum } from "../../events";
import { GetCurrentDictionary } from "../../dictionaries/dictionaryStorage";
import HintView from "./hintsView";
import {
  GetString,
  SetString,
  StringTypesEnum,
} from "../../dictionaries/storage";
import WordListView from "./wordListView";

const SynonymScreen: FC<HomeProps> = ({ navigation }) => {
  const [synArray, setSynArray] = React.useState<SynDefinition[]>([]);

  //instance of API dictionary, update existing synonym list if API changes
  const [currentDict, setCurrentDict] = React.useState<Dictionary>();

  useEffect(() => {
    synArray.forEach((syn) => loadSyn(syn));
  }, [currentDict]);

  const [showingHint, setShowingHint] = React.useState(-1);
  //load default dictionary on loading component, add listener to changeApi event
  useEffect(() => {
    GetString(StringTypesEnum.WasLaunched).then((value) => {
      if (value) return;
      SetString(StringTypesEnum.WasLaunched, "yes");
      setShowingHint(0);
    });

    GetCurrentDictionary().then((dict) => setCurrentDict(dict));
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.ApiChanged,
      () => GetCurrentDictionary().then((dict) => setCurrentDict(dict))
    );
    return () => subscription.remove();
  }, []);

  //entries are an array of prepared data for synonym list, updaded when synArray states change
  const [entries, setEntries] = React.useState<DataEntryClass[]>([]);
  const colorMap = new Map<string, string>();
  synArray.forEach((synDef) => colorMap.set(synDef.Word, synDef.Color));
  useEffect(() => {
    setEntries(Cross(synArray));
  }, [synArray]);

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
    const onSucces = () => setSynArray((previous) => Array.from(previous));
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.synonyms}>
        <ScrollView
          style={{ flex: 1 }}
          fadingEdgeLength={1}
          invertStickyHeaders={true}
          contentContainerStyle={{ paddingVertical: 100 }}
        >
          <SynonymListView
            entries={entries}
            colorMap={colorMap}
            addWord={addWord}
          />
        </ScrollView>
      </View>

      <View style={styles.menuButton}>
        <Button
          title={"Options"}
          onPress={() => navigation.navigate("Options")}
        ></Button>
      </View>

      {showingHint == 2 && (
        <HintView
          style={{ ...styles.hint, top: 80, left: "5%", maxWidth: "90%" }}
          hintText="Select different API if you're not happy with the results"
          onPress={() => setShowingHint((previous) => (previous += 1))}
        />
      )}

      <View style={styles.connectionIndicator}>
        <ActivityIndicator
          animating={synArray.find((synDef) => !synDef.WasFetched) != null}
          size="large"
        />
      </View>

      <WordListView
        synArray={synArray}
        onClearButton={() => setSynArray([])}
        onWordPress={(word) => removeWord(word)}
      />

      {showingHint == 1 && synArray.length > 0 && (
        <HintView
          style={{
            ...styles.hint,
            bottom: 120,
            right: "5%",
            maxWidth: "70%",
          }}
          hintText="Add/remove words to widen/remove the search!"
          onPress={() => setShowingHint((previous) => (previous += 1))}
        />
      )}

      <View style={styles.inputContainer}>
        <WordInputField inputRef={inputRef} onAddWord={addWord} />
      </View>

      {showingHint == 0 && (
        <HintView
          style={{ ...styles.hint, bottom: 120, left: "5%", maxWidth: "90%" }}
          hintText="Enter a word you're looking into"
          onPress={() => setShowingHint((previous) => (previous += 1))}
        />
      )}
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
  hint: {
    zIndex: 2,
    position: "absolute",
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
  synonyms: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default SynonymScreen;
