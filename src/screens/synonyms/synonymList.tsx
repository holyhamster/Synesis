import React, { FC, useMemo, useEffect, useRef, memo, useState } from "react";
import DataEntry from "./data/dataEntry";
import { StyleSheet, View } from "react-native";
import ColorNormal from "./gradient/colorNormal";
import SynonymWord from "./synonymWord";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";

interface SynonymListProps {
  entries: Map<string, DataEntry>;
  colorMap: Map<string, string>;
  addWord: (newWord: string) => void;
  highlightedWord?: string;
}

const SynonymList: FC<SynonymListProps> = memo(
  ({ entries, colorMap, addWord, highlightedWord }) => {
    //console.log(`SynonymList render`);

    const [colorNormals, setColorNormals] = useState(
      new Map<string, ColorNormal>()
    );

    const [sortedEntries, setSortedEntries] = useState<DataEntry[]>([]);
    const transitionView = useRef<TransitioningView>();
    useEffect(() => {
      console.log(`sorted hook ${highlightedWord}`);
      const newSorted = Array.from(entries.values());
      if (highlightedWord?.length > 0)
        newSorted.sort(
          (a, b) =>
            (a.connections.get(highlightedWord) / a.sum || 0) -
            (b.connections.get(highlightedWord) / b.sum || 0)
        );

      setSortedEntries(newSorted);

      transitionView.current?.animateNextTransition();
    }, [entries, highlightedWord]);

    useEffect(() => {
      const map = new Map();
      entries.forEach((entry, name) => {
        const oldNormal = colorNormals.get(name);
        const newNormal = new ColorNormal(entry.GetWordNormal(), colorMap);
        map.set(name, oldNormal?.isEqual(newNormal) ? oldNormal : newNormal);
      });
      setColorNormals(map);
    }, [colorMap, entries]);

    //transView.current?.animateNextTransition();

    return (
      <Transitioning.View
        onLayout={(event) => {
          console.log(event.nativeEvent);
        }}
        ref={transitionView}
        style={styles.list}
        transition={<></>}
      >
        {sortedEntries.map((entry) => {
          const colorNormal = colorNormals.get(entry.name);
          if (colorNormal?.length > 0)
            return (
              <SynonymWord
                key={entry.name}
                word={entry.name}
                colorNormal={colorNormal}
                onPress={() => {
                  addWord(entry.name);
                  //if (transView.current) transView.current.animateNextTransition();
                }}
              />
            );
        })}
      </Transitioning.View>
    );
  }
);

const styles = StyleSheet.create({
  list: {
    flex: 1,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    gap: 7,
    backgroundColor: "yellow",
  },
  word: {
    fontSize: 20,
  },
});

const transition = (
  <Transition.Together>
    <Transition.In type="fade" delayMs={1000} durationMs={500} />
    <Transition.Change delayMs={5000} durationMs={500} />
    <Transition.Out type="fade" delayMs={1000} durationMs={500} />
  </Transition.Together>
);

export default SynonymList;
