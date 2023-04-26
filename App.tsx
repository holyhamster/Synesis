import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
  ScrollView,
} from "react-native";

import WordListView from "./src/wordListView";
import WordInputField from "./src/wordInputField";
import { Merriam } from "./src/dictionaries/meriam/meriam";
import SynonymListView from "./src/synonymListView";
import SynDefinition, { GetNextColor } from "./src/synDefinition";

export default function App() {
  const [synArray, setSynArray] = React.useState<SynDefinition[]>([]);

  const dict = React.useRef(new Merriam(process.env.REACT_APP_API_KEY));

  const addWord = async (word: string) => {
    try {
      if (synArray.findIndex((definiton) => definiton.Word == word) >= 0)
        return;
      const newSyn = new SynDefinition(word);

      setSynArray((previous) => [...previous, newSyn]);

      var response = await dict.current.GetSynonyms(word);
      newSyn.Color = GetNextColor(this.sets);
      newSyn.Sets = response.Sets; //TODO: update when more data than just sets
      setSynArray((previous) => [...previous]);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
      console.log(error.message);
    }
  };

  const removeSyn = (Word: string) => {
    const index = synArray.findIndex((synDef) => synDef.Word == Word);
    if (index < 0) return;
    setSynArray([...synArray.slice(0, index), ...synArray.slice(index + 1)]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WordInputField onAddWord={addWord} />
      <ScrollView style={styles.lists}>
        <WordListView
          synArray={synArray}
          removeWord={(word) => removeSyn(word)}
        />
        <SynonymListView synArray={synArray} addWord={addWord} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
  },
  lists: {
    marginTop: "10%",
  },
});
