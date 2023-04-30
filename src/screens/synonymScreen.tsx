import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  ToastAndroid,
  View,
  ScrollView,
  Button,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import WordInputField from "../wordInputField";
import Merriam from "../dictionaries/meriam/meriam";
import SynonymListView from "../synonymListView";
import SynDefinition, { GetNextColor } from "../synDefinition";

const SynonymScreen = ({ navigation }) => {
  const [synArray, setSynArray] = React.useState<SynDefinition[]>([]);

  const dict = React.useRef(new Merriam(process.env.REACT_APP_API_KEY));

  const addWord = async (word: string) => {
    try {
      if (synArray.findIndex((definiton) => definiton.Word == word) >= 0)
        return;
      const newSyn = new SynDefinition(word);

      setSynArray((previous) => [...previous, newSyn]);

      var response = await dict.current.GetSynonyms(word);
      newSyn.Color = GetNextColor(synArray);
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
      <View style={styles.synonyms}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 100 }}
        >
          <SynonymListView synArray={synArray} addWord={addWord} />
        </ScrollView>
      </View>
      <View style={styles.menuButton}>
        <Button
          title={"Options"}
          onPress={() => navigation.navigate("Options")}
        ></Button>
      </View>
      <View style={styles.connectionIndicator}></View>
      <View style={styles.selectedContainer}>
        <View style={styles.selectedList}>
          {synArray.map((synDef, index) => (
            <Button
              key={index}
              title={synDef.Word}
              color={synDef.Color}
              onPress={() => removeSyn(synDef.Word)}
            />
          ))}
        </View>
        <View style={styles.selectedClearButton}>
          <Button title={"clear"} onPress={() => {}}></Button>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputField}>
          <WordInputField onAddWord={addWord} />
        </View>

        <View style={styles.inputAddButton}>
          <Button title={"add"} onPress={() => {}}></Button>
        </View>
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
    backgroundColor: "blue",
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
  },
  inputAddButton: {
    flex: 1,
    backgroundColor: "blue",
  },
  inputContainer: {
    backgroundColor: "pink",
    marginVertical: 10,
    flexDirection: "row",
  },
  inputField: {
    flex: 5,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "violet",
    zIndex: 1,
  },

  lists: {
    marginTop: "10%",
  },
});

export default SynonymScreen;
