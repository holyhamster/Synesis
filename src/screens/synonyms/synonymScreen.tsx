import { StatusBar } from "expo-status-bar";
import React, { FC, useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, DeviceEventEmitter } from "react-native";

import SynonymList from "./synonymList";
import Dictionary from "../../dictionaries/dictionary";
import { SynesisProps } from "../../navigation";
import { EventsEnum } from "../../events";
import { GetCurrentDictionary } from "../../dictionaries/dictionaryLoading";
import * as Colors from "../../colors";
import { useSynonyms } from "../../dictionaries/data/useSynonyms";
import ControlPanelView from "./controlPanel";
import { useHints } from "./useHints";
import { useIsFocused } from "@react-navigation/native";
import useCachedMemo from "../../useCachedMemo";

//main screen
const SynonymScreen: FC<SynesisProps> = ({ navigation }) => {
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

  useHints(useIsFocused(), synonyms.length);

  const colorRef = useCachedMemo(
    (previous) =>
      Colors.RebuildColorMap(
        previous,
        synonyms.map((element) => element.Word)
      ),
    [synonyms]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <SynonymList
        synonyms={synonyms.filter(
          (synonym) => synonym.WasFetched && !synonym.IsEmpty
        )}
        colorMap={colorRef}
        addNewWord={addWord}
        wordToSortBy={highlightedWord}
      />

      <View style={styles.controlView}>
        <ControlPanelView
          synonyms={synonyms}
          colorMap={colorRef}
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
