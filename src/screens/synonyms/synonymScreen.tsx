import { StatusBar } from "expo-status-bar";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  DeviceEventEmitter,
} from "react-native";

import SynonymList from "./synonymList";
import Dictionary from "../../dictionaries/dictionary";
import { SynesisProps } from "../../navigation";
import { EventsEnum } from "../../events";
import { GetCurrentDictionary } from "../../dictionaries/dictionaryLoading";
import Storage, { StringTypesEnum } from "../../dictionaries/storageHandling";
import HintOverlay from "./hintOverlay";
import * as Colors from "../../colors";
import { useSynonyms } from "../../dictionaries/data/useSynonyms";
import ControlPanelView from "./controlPanel";

//main screen
const SynonymScreen: FC<SynesisProps> = ({ navigation }) => {
  //check if hints need to be shown and listen an event if it changes
  const [showingHint, setShowingHint] = React.useState(-1);
  useEffect(() => {
    const loadHints = () =>
      Storage.GetString(StringTypesEnum.WasLaunched).then((value) => {
        if (!value) {
          Storage.SetString(StringTypesEnum.WasLaunched, "yes");
          setShowingHint(0);
        }
      });

    loadHints();
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.HintsReset,
      loadHints
    );

    return () => subscription.remove();
  }, []);

  //load default dictionary and listen an event if it changes
  const [dictionary, setDictionary] = React.useState<Dictionary>();
  useEffect(() => {
    const loadDictionaryFromMemory = () =>
      GetCurrentDictionary().then((newDictionary) =>
        setDictionary(newDictionary)
      );

    loadDictionaryFromMemory();
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.ApiChanged,
      loadDictionaryFromMemory
    );
    return () => subscription.remove();
  }, []);

  //
  const [highlightedWord, setHighlightedWord] = useState("");
  const onWordRemoval = useCallback(
    (removedWord) => {
      setHighlightedWord((previous) =>
        previous == removedWord ? "" : previous
      );
    },
    [setHighlightedWord]
  );

  const { synonyms, addWord, removeWord, clearWords } = useSynonyms(
    dictionary,
    onWordRemoval
  );

  const colorRef = useRef(new Map<string, string>());
  colorRef.current = Colors.RebuildColorMap(
    colorRef.current,
    synonyms.map((element) => element.Word)
  );

  const wordsBeingFetched =
    synonyms.find((synonym) => !synonym.WasFetched) != null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <HintOverlay
        onHintPress={() => setShowingHint((previous) => (previous += 1))}
        currentHintID={showingHint}
        synonymsExist={synonyms.length > 0}
      />

      <SynonymList
        synonyms={synonyms.filter(
          (synonym) => synonym.WasFetched && !synonym.IsEmpty
        )}
        colorMap={colorRef.current}
        addNewWord={addWord}
        wordToSortBy={highlightedWord}
      />
      <View style={styles.connectionIndicator}>
        <ActivityIndicator
          pointerEvents="none"
          animating={wordsBeingFetched}
          size="large"
          color={Colors.CountourColor}
        />
      </View>

      <View style={styles.controlView}>
        <ControlPanelView
          synonyms={synonyms}
          colorMap={colorRef.current}
          highlightedWord={highlightedWord}
          onClearButton={clearWords}
          onWordPress={(word) => removeWord(word)}
          onWordLongPress={(word) => setHighlightedWord(word)}
          onOptions={() => navigation.navigate("Options")}
          onAddWord={addWord}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  connectionIndicator: {
    position: "absolute",
    right: 10,
    top: 50,
    width: 40,
    height: 40,
    zIndex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
  },

  controlView: {
    backgroundColor: Colors.AccentColor,
    paddingVertical: 5,
  },
});

export default SynonymScreen;
