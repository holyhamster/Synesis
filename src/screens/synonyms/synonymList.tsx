import React, { FC, useEffect, useRef, useState } from "react";
import {
  DeviceEventEmitter,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
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
import { EventsEnum } from "../../events";
import {
  GetStringFromStorage,
  StringTypesEnum,
} from "../../dictionaries/storageHandling";

interface SynonymListProps {
  synonyms: SynonymCollection[];
  colorMap: Map<string, string>;
  highlightedWord?: string;
  addNewWord: (newWord: string) => void;
  showTooltip?: (text: string) => void;
}

const SynonymList: FC<SynonymListProps> = ({
  synonyms,
  colorMap,
  highlightedWord,
  addNewWord,
  showTooltip,
}) => {
  //console.log(`SynonymList render`);
  const [tileLimit, setTileLimit] = useState(defaultLimit);
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.TileCountChanged,
      () =>
        GetStringFromStorage(StringTypesEnum.TileCount).then((value) =>
          setTileLimit(parseInt(value) ?? defaultLimit)
        )
    );
    return () => subscription.remove();
  }, []);

  const [tileLayout, setTileLayout] = React.useState(false);
  useEffect(() => {
    const setLayoutfromMemory = () =>
      GetStringFromStorage(StringTypesEnum.TileLayout).then((value) => {
        if (value && value != "") setTileLayout(true);
        else setTileLayout(false);
      });

    setLayoutfromMemory();
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.LayoutChanged,
      setLayoutfromMemory
    );

    return () => subscription.remove();
  }, []);

  const transitionView = useRef<TransitioningView>();
  const animateTransition = () =>
    transitionView.current?.animateNextTransition();

  const [clouds, setClouds] = useState<SynonymCloud[]>([]);
  useEffect(() => {
    const newClouds = SynonymCloud.GetSorted(
      CrossReference(synonyms),
      highlightedWord
    );
    setClouds(newClouds);
    animateTransition();
  }, [synonyms, setClouds]);

  useEffect(() => {
    setClouds((previous) => SynonymCloud.GetSorted(previous, highlightedWord));
  }, [highlightedWord]);

  const [colorNormals, setColorNormals] = useState(
    new Map<string, ColorNormal>()
  );
  useEffect(() => {
    setColorNormals((previous) => rebuildNormals(clouds, colorMap, previous));
  }, [clouds, colorMap]);

  useEffect(() => {
    const hiddenCount = Math.max(clouds.length - tileLimit, 0);
    showTooltip?.(hiddenCount == 0 ? "" : `Hidden: ${hiddenCount}`);
  }, [showTooltip, tileLimit, clouds]);

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
  //TODO: animation of flatlist layout
  if (true || tileLayout) {
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
          {clouds.slice(-tileLimit).map((cloud) => renderCloud(cloud))}
        </Transitioning.View>
      </ScrollView>
    );
  } else
    return (
      <FlatList
        data={clouds}
        keyExtractor={(entry) => entry.name}
        renderItem={({ item }) => renderCloud(item)}
        keyboardShouldPersistTaps="handled"
        fadingEdgeLength={1}
        snapToEnd={true}
        contentContainerStyle={styles.flatListContainer}
      />
    );
};

const defaultLimit = 30;

const styles = StyleSheet.create({
  countTooltip: {
    position: "absolute",
    top: 0,
    right: 0,
  },
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
    <Transition.Change durationMs={100} />
    <Transition.Out type="fade" durationMs={500} />
  </Transition.Together>
);

export default SynonymList;
