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
  //console.log("screen render");

  //check if hinst need to be shown
  const [showingHint, setShowingHint] = React.useState(-1);

  useEffect(() => {
    GetStringFromStorage(StringTypesEnum.WasLaunched).then((value) => {
      if (!value) {
        SetStringInStorage(StringTypesEnum.WasLaunched, "yes");
        setShowingHint(0);
      }
    });
  }, []);

  //load default dictionary on loading component, add listener to changeApi event
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
  colorRef.current = rebuildColorMap(
    colorRef.current,
    synonyms.map((element) => element.Word)
  );

  const [listTooltip, setListTooltip] = useState("");
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
        highlightedWord={highlightedWord}
        showTooltip={(tooltip) => setListTooltip(tooltip)}
      />

      <View style={styles.menuButton}>
        <MaterialButton
          onPress={() => navigation.navigate("Options")}
          name="settings"
          style={{ size: 50 }}
        />

        {listTooltip && (
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

      <View style={styles.connectionIndicator}>
        <ActivityIndicator
          pointerEvents="none"
          animating={synonyms.find((synonym) => !synonym.WasFetched) != null}
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
          onWordPress={(word) => removeWord(word)}
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

function rebuildColorMap(oldMap: Map<string, string>, words: string[]) {
  const takenColors = new Set<string>();
  oldMap.forEach((color, word) => {
    if (words.includes(word)) takenColors.add(color);
  });

  const newColormap = new Map<string, string>();
  words.forEach((word) => {
    const color =
      oldMap.get(word) || Colors.getFreeColor(Array.from(takenColors));
    newColormap.set(word, color);
    takenColors.add(color);
  });
  return newColormap;
}

export default SynonymScreen;
