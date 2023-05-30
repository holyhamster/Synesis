import React, { FC, useMemo, useEffect, useRef, memo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ColorNormal from "./gradient/colorNormal";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import SynonymCloud from "../../dictionaries/data/synonymCloud";
import SynonymWord from "./synonymWord";

interface SynonymListProps {
  clouds: Map<string, SynonymCloud>;
  colorMap: Map<string, string>;
  addWord: (newWord: string) => void;
  highlightedWord?: string;
}

const SynonymList: FC<SynonymListProps> = memo(
  ({ clouds, colorMap, addWord, highlightedWord }) => {
    //console.log(`SynonymList render`);

    const [colorNormals, setColorNormals] = useState(
      new Map<string, ColorNormal>()
    );

    const [sortedEntries, setSortedEntries] = useState<SynonymCloud[]>([]);
    const transitionView = useRef<TransitioningView>();
    useEffect(() => {
      const newSorted = Array.from(clouds.values());
      if (highlightedWord?.length > 0)
        newSorted.sort(
          (a, b) =>
            (a.connections.get(highlightedWord) / a.sum || 0) -
            (b.connections.get(highlightedWord) / b.sum || 0)
        );
      setSortedEntries(newSorted.slice(-wordLimit, -1));
      transitionView.current?.animateNextTransition();
    }, [clouds, highlightedWord]);

    useEffect(() => {
      const map = new Map();
      clouds.forEach((cloud, name) => {
        const oldNormal = colorNormals.get(name);
        const newNormal = new ColorNormal(cloud.GetWordNormal(), colorMap);
        map.set(name, oldNormal?.isEqual(newNormal) ? oldNormal : newNormal);
      });
      setColorNormals(map);
    }, [colorMap, clouds]);

    const transitionInProgress = useRef(false);

    return (
      <Transitioning.View
        ref={transitionView}
        style={styles.list}
        transition={transition}
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
const wordLimit = 30;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    gap: 7,
  },
  word: {
    fontSize: 20,
  },
});

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={500} />
    <Transition.Out type="fade" durationMs={500} />
  </Transition.Together>
);

export default SynonymList;
