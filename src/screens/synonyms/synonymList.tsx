import React, { FC, useEffect, useRef, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import ColorNormal from "./gradient/colorNormal";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import SynonymCloud, {
  CrossReference,
} from "../../dictionaries/data/synonymCloud";
import SynonymWord from "./synonymWord";
import SynonymCollection from "../../dictionaries/data/synonymCollection";

interface SynonymListProps {
  synArray: SynonymCollection[];
  colorMap: Map<string, string>;
  highlightedWord?: string;
  addNewWord: (newWord: string) => void;
  tileLayout?: boolean;
}

const SynonymList: FC<SynonymListProps> = ({
  synArray,
  colorMap,
  highlightedWord,
  addNewWord,
  tileLayout,
}) => {
  //console.log(`SynonymList render`);

  const [colorNormals, setColorNormals] = useState(
    new Map<string, ColorNormal>()
  );

  const [sortedEntries, setSortedEntries] = useState<SynonymCloud[]>([]);
  const transitionView = useRef<TransitioningView>();

  useEffect(() => {
    const newClouds = CrossReference(synArray);
    setSortedEntries(SynonymCloud.GetSorted(newClouds, highlightedWord));
    if (tileLayout) transitionView.current?.animateNextTransition();
  }, [synArray]);

  useEffect(() => {
    setSortedEntries(SynonymCloud.GetSorted(sortedEntries, highlightedWord));
  }, [highlightedWord]);

  useEffect(() => {
    setColorNormals(rebuildNormals(sortedEntries, colorMap, colorNormals));
  }, [sortedEntries, colorMap]);

  const renderCloud = (cloud: SynonymCloud) => {
    return (
      <SynonymWord
        key={cloud.name}
        word={cloud.name}
        colorNormal={colorNormals.get(cloud.name)}
        onPress={addNewWord}
      />
    );
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
          {sortedEntries.slice(-wordLimit).map((cloud) => renderCloud(cloud))}
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
};
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

function rebuildNormals(
  clouds: SynonymCloud[],
  colorMap: Map<string, string>,
  oldNormals: Map<string, ColorNormal>
) {
  const map = new Map<string, ColorNormal>();
  clouds.forEach((cloud) => {
    const oldNormal = oldNormals.get(cloud.name);
    const newNormal = new ColorNormal(cloud.GetWordNormal(), colorMap);
    if (!newNormal.IsValid) return;
    map.set(cloud.name, oldNormal?.isEqual(newNormal) ? oldNormal : newNormal);
  });
  return map;
}
const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={500} />
    <Transition.Out type="fade" durationMs={500} />
  </Transition.Together>
);

export default SynonymList;
