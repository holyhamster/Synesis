import { FC } from "react";
import { Button, StyleSheet, View } from "react-native";
import SynDefinition from "../../synDefinition";

interface WordListProps {
  synArray: SynDefinition[];
  removeWord: (word: string) => void;
}

/*List of selected words, removes a word if its pressed*/
const WordListView: FC<WordListProps> = ({ synArray, removeWord }) => {
  const { buttonRow } = StyleSheet.create({
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      marginHorizontal: 5,
      gap: 5,
    },
  });

  return (
    <View style={buttonRow}>
      {synArray.map((synDef, index) => (
        <Button
          key={index}
          title={synDef.Word}
          color={synDef.Color}
          onPress={() => removeWord(synDef.Word)}
        />
      ))}
    </View>
  );
};

export default WordListView;
