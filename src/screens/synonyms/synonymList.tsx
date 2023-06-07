import React, { FC, useMemo, useEffect, useRef, memo, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
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
  highlightedWord?: string;
  addNewWord: (newWord: string) => void;
  tileLayout?: boolean;
}

const SynonymList: FC<SynonymListProps> = memo(
  ({ clouds, colorMap, highlightedWord, addNewWord, tileLayout }) => {
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
            (a.GetWordMap().get(highlightedWord) || 0) -
            (b.GetWordMap().get(highlightedWord) || 0)
        );
      setSortedEntries(newSorted);
      if (tileLayout) transitionView.current?.animateNextTransition();
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

    const renderCloud = (cloud) => {
      const colorNormal = colorNormals.get(cloud.name);
      if (colorNormal?.length > 0)
        return (
          <SynonymWord
            key={cloud.name}
            word={cloud.name}
            colorNormal={colorNormal}
            onPress={() => addNewWord(cloud.name)}
          />
        );
      return <></>;
    };

    if (tileLayout) {
      return (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.synonymScroll}
          fadingEdgeLength={1}
          snapToEnd={true}
          contentContainerStyle={styles.synonymScrollContainer}
        >
          <Transitioning.View
            ref={transitionView}
            style={styles.list}
            transition={transition}
          >
            {sortedEntries
              .slice(-wordLimit, -1)
              .map((cloud) => renderCloud(cloud))}
          </Transitioning.View>
        </ScrollView>
      );
    } else
      return (
        <FlatList
          data={sortedEntries}
          keyExtractor={(entry) => entry.name}
          renderItem={({ item }) => renderCloud(item)}
          keyboardShouldPersistTaps="handled"
          fadingEdgeLength={1}
          snapToEnd={true}
          contentContainerStyle={styles.flatListContainer}
        />
      );
  }
);
const wordLimit = 40;

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    gap: 5,
    columnGap: 100,
    paddingVertical: 5,
  },
  list: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    gap: 7,
  },
  synonymScroll: {
    zIndex: 1,
  },
  synonymScrollContainer: {
    flexGrow: 1,
    columnGap: 100,
    paddingVertical: 5,
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
