import React, { FC, useMemo, useCallback, useRef, useEffect } from "react";
import DataEntryClass from "./data/dataEntry";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import SynonymWord from "./synonymWord";
import ColorNormal from "./data/colorNormal";

interface SynonymListProps {
  entries: Map<string, DataEntryClass>;
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
  console.log("list render");
  console.log(entries);
  console.log(colorMap);

  //const [cachedEntries, setCachedEntries] = React.useState(entries);

  const colorNormals = useRef(new Map<string, ColorNormal>());
  useEffect;
  useMemo(() => {
    //colorNormals.current.clear();
    entries.forEach((entry, name) => {
      const normal = new ColorNormal(entry.GetWordNormal(), colorMap);
      const oldNormal = colorNormals.current.get(name);
      if (!oldNormal || !oldNormal.isEqual(normal))
        colorNormals.current.set(name, normal);
    });
  }, [colorMap, entries]);

  const onWordPress = useCallback(
    (name) => () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      addWord(name);
    },
    [addWord]
  );

  return (
    <View style={{ ...styles.list }}>
      {Array.from(entries.values()).map((entry) => {
        const colorNormal = colorNormals.current.get(entry.name);
        if (!colorNormal?.isValid) return <></>;
        return (
          <TouchableOpacity key={entry.name} onPress={onWordPress(entry.name)}>
            <SynonymWord
              word={entry.name}
              style={styles.word}
              colorNormal={colorNormal}
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
  word: {
    fontSize: 20,
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
