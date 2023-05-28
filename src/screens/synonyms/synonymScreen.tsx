import { StatusBar } from "expo-status-bar";
import React, { FC, useEffect, useMemo, useCallback, useState } from "react";
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
import SynonymList from "./synonymList";
import SynonymCollection from "./data/synonymCollection";
import SynonymCloud, { Cross } from "./data/dataEntry";
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

const SynonymScreen: FC<HomeProps> = ({ navigation }) => {
  //console.log("screen render");

  //check if hinst need to be shown
  const [showingHint, setShowingHint] = React.useState(-1);
  useEffect(() => {
    GetStringFromStorage(StringTypesEnum.WasLaunched).then((value) => {
      if (value) return;
      SetStringInStorage(StringTypesEnum.WasLaunched, "yes");
      setShowingHint(0);
    });
  }, []);

  const [synArray, setSynArray] = React.useState<SynonymCollection[]>([]);
  const forceSynArrayUpdate = useCallback(
    () => setSynArray((previous) => Array.from(previous)),
    [setSynArray]
  );

  //instance of API dictionary, update existing synonym list if API changes
  const [currentDict, setCurrentDict] = React.useState<Dictionary>();
  useEffect(() => {
    synArray.forEach((syn) =>
      loadSyn(syn, currentDict, () =>
        setSynArray((previous) => Array.from(previous))
      )
    );
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
  const clouds = useMemo(() => {
    const map = new Map<string, SynonymCloud>();
    //console.log(JSON.stringify(Cross(synArray)));
    Cross(synArray).forEach((cloud) => map.set(cloud.name, cloud));
    return map;
  }, [synArray]);

  const [highlightedWord, setHighlightedWord] = useState("");
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    synArray.forEach((synDef) => map.set(synDef.Word, synDef.Color));
    return map;
  }, [synArray]);

  const addWord = useCallback(
    (word: string) => {
      const newSyn = new SynonymCollection(
        word,
        synArray.map((syn) => syn.Color)
      );

      if (
        newSyn &&
        newSyn.Word != "" &&
        synArray.findIndex((definiton) => definiton.Word == newSyn.Word) == -1
      ) {
        setSynArray((previous) => [...previous, newSyn]);
        loadSyn(newSyn, currentDict, forceSynArrayUpdate);
      }
    },
    [synArray, setSynArray, currentDict, forceSynArrayUpdate]
  );

  const removeWord = useCallback(
    (Word: string) => {
      const index = synArray.findIndex((synDef) => synDef.Word == Word);
      if (index < 0) return;
      setSynArray([...synArray.slice(0, index), ...synArray.slice(index + 1)]);
      if (highlightedWord == Word) setHighlightedWord("");
    },
    [synArray, setSynArray]
  );

  const inputRef = React.useRef<TextInput>();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <HintOverlay
        onHintPress={() => setShowingHint((previous) => (previous += 1))}
        currentHintID={showingHint}
        synonymsExist={synArray.length > 0}
      />

      <ScrollView
        style={styles.synonymScroll}
        fadingEdgeLength={1}
        snapToEnd={true}
        contentContainerStyle={styles.synonymScrollContainer}
      >
        <SynonymList
          clouds={clouds}
          colorMap={colorMap}
          addWord={addWord}
          highlightedWord={highlightedWord}
        />
      </ScrollView>

      <View style={styles.menuButton}>
        <Button
          title={"Options"}
          onPress={() => navigation.navigate("Options")}
        ></Button>
      </View>

      <View style={styles.connectionIndicator}>
        <ActivityIndicator
          pointerEvents="none"
          animating={synArray.find((synDef) => !synDef.WasFetched) != null}
          size="large"
        />
      </View>

      <WordListView
        synArray={synArray}
        onClearButton={() => setSynArray([])}
        onWordPress={(word) => removeWord(word)}
        onLongPress={(word) => setHighlightedWord(word)}
      />

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

  synonymScroll: {
    zIndex: 1,
  },
  synonymScrollContainer: {
    flexGrow: 1,
    columnGap: 100,
    paddingVertical: 5,
    backgroundColor: "magenta",
  },
});

async function loadSyn(
  syn: SynonymCollection,
  currentDict: Dictionary,
  updateCallback: () => void
) {
  const onFail = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
    updateCallback();
  };

  return syn.Load(currentDict, updateCallback, onFail);
}

export default SynonymScreen;

const mock = `[{"name":"right","connections":{},"sum":1},{"name":"well","connections":{},"sum":1},{"name":"sound","connections":{},"sum":1},{"name":"keen","connections":{},"sum":1},{"name":"great","connections":{},"sum":1},{"name":"best","connections":{},"sum":1},{"name":"close","connections":{},"sum":1},{"name":"kind","connections":{},"sum":1},{"name":"effective","connections":{},"sum":1},{"name":"fine","connections":{},"sum":1},{"name":"cool","connections":{},"sum":1},{"name":"swell","connections":{},"sum":1},{"name":"just","connections":{},"sum":1},{"name":"complete","connections":{},"sum":1},{"name":"nice","connections":{},"sum":1},{"name":"safe","connections":{},"sum":1},{"name":"hot","connections":{},"sum":1},{"name":"secure","connections":{},"sum":1},{"name":"genuine","connections":{},"sum":1},{"name":"fresh","connections":{},"sum":1},{"name":"adept","connections":{},"sum":1},{"name":"benevolent","connections":{},"sum":1},{"name":"neat","connections":{},"sum":1},{"name":"solid","connections":{},"sum":1},{"name":"expert","connections":{},"sum":1},{"name":"superior","connections":{},"sum":1},{"name":"bully","connections":{},"sum":1},{"name":"full","connections":{},"sum":1},{"name":"beneficial","connections":{},"sum":1},{"name":"gracious","connections":{},"sum":1},{"name":"serious","connections":{},"sum":1},{"name":"healthy","connections":{},"sum":1},{"name":"proficient","connections":{},"sum":1},{"name":"near","connections":{},"sum":1},{"name":"intellectual","connections":{},"sum":1},{"name":"dear","connections":{},"sum":1},{"name":"ample","connections":{},"sum":1},{"name":"suitable","connections":{},"sum":1},{"name":"righteous","connections":{},"sum":1},{"name":"dandy","connections":{},"sum":1},{"name":"thoroughly","connections":{},"sum":1},{"name":"virtuous","connections":{},"sum":1},{"name":"nifty","connections":{},"sum":1},{"name":"sunday","connections":{},"sum":1},{"name":"salutary","connections":{},"sum":1},{"name":"ripe","connections":{},"sum":1},{"name":"superb","connections":{},"sum":1},{"name":"operative","connections":{},"sum":1},{"name":"upright","connections":{},"sum":1},{"name":"dependable","connections":{},"sum":1},{"name":"acceptable","connections":{},"sum":1},{"name":"beneficent","connections":{},"sum":1},{"name":"goodness","connections":{},"sum":1},{"name":"groovy","connections":{},"sum":1},{"name":"fortunate","connections":{},"sum":1},{"name":"honorable","connections":{},"sum":1},{"name":"satisfactory","connections":{},"sum":1},{"name":"advantageous","connections":{},"sum":1},{"name":"reputable","connections":{},"sum":1},{"name":"cracking","connections":{},"sum":1},{"name":"opportune","connections":{},"sum":1},{"name":"kindly","connections":{},"sum":1},{"name":"peachy","connections":{},"sum":1},{"name":"beatific","connections":{},"sum":1},{"name":"angelic","connections":{},"sum":1},{"name":"respectable","connections":{},"sum":1},{"name":"skillful","connections":{},"sum":1},{"name":"smashing","connections":{},"sum":1},{"name":"skilful","connections":{},"sum":1},{"name":"pleasing","connections":{},"sum":1},{"name":"skilled","connections":{},"sum":1},{"name":"estimable","connections":{},"sum":1},{"name":"bang-up","connections":{},"sum":1},{"name":"discriminating","connections":{},"sum":1},{"name":"healthful","connections":{},"sum":1},{"name":"soundly","connections":{},"sum":1},{"name":"redemptive","connections":{},"sum":1},{"name":"practiced","connections":{},"sum":1},{"name":"angelical","connections":{},"sum":1},{"name":"in effect","connections":{},"sum":1},{"name":"saintly","connections":{},"sum":1},{"name":"in force","connections":{},"sum":1},{"name":"openhearted","connections":{},"sum":1},{"name":"slap-up","connections":{},"sum":1},{"name":"unspoiled","connections":{},"sum":1},{"name":"corking","connections":{},"sum":1},{"name":"goody-goody","connections":{},"sum":1},{"name":"goodish","connections":{},"sum":1},{"name":"sainted","connections":{},"sum":1},{"name":"good-hearted","connections":{},"sum":1},{"name":"unspoilt","connections":{},"sum":1},{"name":"well-behaved","connections":{},"sum":1},{"name":"sunday-go-to-meeting","connections":{},"sum":1},{"name":"good enough","connections":{},"sum":1},{"name":"saintlike","connections":{},"sum":1},{"name":"go-to-meeting","connections":{},"sum":1},{"name":"well behaved","connections":{},"sum":1}]`;
