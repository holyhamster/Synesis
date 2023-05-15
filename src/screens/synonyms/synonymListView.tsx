import React, { FC } from "react";
import DataEntryClass from "./data/dataEntry";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import SynonymWord from "./synonymWord";
import ColorNormal from "./data/colorNormal";

interface SynonymListProps {
  entries: DataEntryClass[];
  colorMap: Map<string, string>;
  addWord: (newWord: string) => void;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SynonymListView: FC<SynonymListProps> = ({
  entries,
  colorMap,
  addWord,
}) => {
  React.useEffect(() => {}, [entries]);

  return (
    <View style={{ ...styles.list }}>
      {entries.map((entry) => {
        const normal = new ColorNormal(entry.GetWordNormal(), colorMap);
        if (normal.isValid)
          return (
            <TouchableOpacity
              key={entry.name}
              onPress={() => addWord(entry.name)}
            >
              <SynonymWord
                word={entry.name}
                style={{ fontSize: 20 }}
                colorNormal={normal}
              />
            </TouchableOpacity>
          );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
  },
});

function getFontSizer(sizes: number[]) {
  const minFontSize = 20;
  const maxFontSize = 40;
  let smallest = Math.min(...sizes);
  let largest = Math.max(...sizes);
  if (smallest === largest) {
    return () => {
      Math.round((maxFontSize + minFontSize) / 2);
    };
  }
  return (size: number) => {
    return Math.round(
      minFontSize +
        ((maxFontSize - minFontSize) * (size - smallest)) / (largest - smallest)
    );
  };
}

export default SynonymListView;
