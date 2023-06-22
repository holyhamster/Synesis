import { StatusBar } from "expo-status-bar";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  DeviceEventEmitter,
  Text,
  TouchableOpacity,
} from "react-native";

import WordInputField from "./wordInputField";
import SynonymList from "./synonymList";
import Dictionary from "../../dictionaries/dictionary";
import { HomeProps } from "../../navigation";
import { EventsEnum } from "../../events";
import { GetCurrentDictionary } from "../../dictionaries/dictionaryOptions";
import {
  GetStringFromStorage,
  SetStringInStorage,
  StringTypesEnum,
} from "../../dictionaries/storageHandling";
import WordListView from "./wordListView";
import HintOverlay from "./hintOverlay";
import * as Colors from "../../colors";
import MaterialButton from "../materialButton";
import { useSynonyms } from "../../dictionaries/data/useSynonyms";
import { OptionSectionsEnum } from "../options/optionsScreen";

const SynonymScreen: FC<HomeProps> = ({ navigation }) => {
  //check if hints need to be shown and listen an event if it changes
  const [showingHint, setShowingHint] = React.useState(-1);
  useEffect(() => {
    const loadHints = () =>
      GetStringFromStorage(StringTypesEnum.WasLaunched).then((value) => {
        if (!value) {
          SetStringInStorage(StringTypesEnum.WasLaunched, "yes");
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

  //tooltip text at the top of the screen
  const [listTooltip, setListTooltip] = useState("");

  const addAndHighlight = useCallback(
    (word) => {
      addWord(word);
      setHighlightedWord(word);
    },
    [addWord, setHighlightedWord]
  );

  const menuSegment = (
    <View style={styles.menuButton}>
      <MaterialButton
        onPress={() => navigation.navigate("Options")}
        name="settings"
        style={{ size: 50 }}
      />

      {listTooltip != "" && (
        <TouchableOpacity
          style={styles.hiddenElementsTooltip}
          onPress={() => {
            navigation.navigate("Options", {
              unravel: OptionSectionsEnum.Display,
            });
          }}
        >
          <Text>{listTooltip}</Text>
        </TouchableOpacity>
      )}
    </View>
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
        addAndHiglight={addAndHighlight}
        wordToSortBy={highlightedWord}
        showTooltip={(tooltip) => setListTooltip(tooltip)}
      />

      {menuSegment}

      <View style={styles.connectionIndicator}>
        <ActivityIndicator
          pointerEvents="none"
          animating={wordsBeingFetched}
          size="large"
          color={Colors.CountourColor}
        />
      </View>

      <View style={styles.selectedList}>
        <WordListView
          synonymArray={synonyms}
          colorMap={colorRef.current}
          highlighted={highlightedWord}
          onClearButton={clearWords}
          onPress={(word) => removeWord(word)}
          onLongPress={(word) => setHighlightedWord(word)}
        />
      </View>

      <View style={styles.inputContainer}>
        <WordInputField onAddWord={addWord} />
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

  inputContainer: {
    flexDirection: "row",
    backgroundColor: Colors.AccentColor,
    paddingVertical: 5,
  },

  menuButton: {
    flexDirection: "row",
    position: "absolute",
    left: 10,
    top: 50,
    zIndex: 1,
  },

  hiddenElementsTooltip: {
    left: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 5,
    backgroundColor: Colors.BGWhite,
  },
  selectedList: {
    backgroundColor: Colors.AccentColor,
    paddingVertical: 5,
  },
});

export default SynonymScreen;
