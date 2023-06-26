import React, { FC, useEffect, useRef, useState } from "react";
import {
  DeviceEventEmitter,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import SynonymCloud, {
  CrossReference,
} from "../../dictionaries/data/synonymCloud";
import ColorNormal from "./colorChart/colorNormal";
import SynonymWord from "./synonymWord";
import SynonymCollection from "../../dictionaries/data/synonymCollection";
import { EventsEnum } from "../../events";
import Storage, { StringTypesEnum } from "../../dictionaries/storageHandling";

interface SynonymListProps {
  synonyms: SynonymCollection[];
  colorMap: Map<string, string>;
  wordToSortBy?: string;
  addNewWord: (newWord: string) => void;
  addAndHiglight: (newWord: string) => void;
  showTooltip?: (text: string) => void;
  style?: ViewStyle;
}
//Builds clouds of words from synonyms and displays them in a ScrollList
const SynonymList: FC<SynonymListProps> = ({
  synonyms,
  colorMap,
  wordToSortBy,
  addNewWord,
  addAndHiglight,
  showTooltip,
  style,
}) => {
  //layout transition for tile movement (only on android)
  const transitionViewRef = useRef<TransitioningView>();
  const animateTransition = () => {
    if (Platform.OS == "android")
      transitionViewRef.current?.animateNextTransition();
  };

  //process synonyms into word clouds
  const [clouds, setClouds] = useState<SynonymCloud[]>([]);
  useEffect(() => {
    const newClouds = SynonymCloud.GetSorted(
      CrossReference(synonyms),
      wordToSortBy
    );
    setClouds(newClouds);
    animateTransition();
  }, [synonyms, setClouds]);

  useEffect(() => {
    setClouds((previous) => SynonymCloud.GetSorted(previous, wordToSortBy));
  }, [wordToSortBy]);

  //build color normals for clouds
  const [colorNormals, setColorNormals] = useState(
    new Map<string, ColorNormal>()
  );
  useEffect(
    () =>
      setColorNormals((previous) => rebuildNormals(clouds, colorMap, previous)),
    [clouds, colorMap]
  );

  //get tileLimit value out of memory
  const [tileLimit, setTileLimit] = useState(DEFAULT_TILE_LIMIT);
  useEffect(() => {
    const loadTilelimit = () => {
      Storage.GetString(StringTypesEnum.TileCount).then((value) =>
        setTileLimit(parseInt(value) ?? DEFAULT_TILE_LIMIT)
      );
    };
    loadTilelimit();
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.TileCountChanged,
      loadTilelimit
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const hiddenCount = Math.max(clouds.length - tileLimit, 0);
    const toolTipText = hiddenCount == 0 ? "" : `Hidden: ${hiddenCount}`;
    showTooltip?.(toolTipText);
  }, [showTooltip, tileLimit, clouds]);

  const zIndex = style?.zIndex ?? 0;

  const cloudComponents = clouds
    .slice(-tileLimit)
    .map(({ name }) => (
      <SynonymWord
        key={name}
        word={name}
        colorNormal={colorNormals.get(name)}
        onPress={addNewWord}
        onLongPress={addAndHiglight}
        style={{ zIndex: zIndex + 1 }}
      />
    ));

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ zIndex: zIndex }}
      fadingEdgeLength={1}
      snapToEnd={true}
      contentContainerStyle={styles.synonymScrollContainer}
    >
      {Platform.OS == "android" ? (
        <Transitioning.View
          ref={transitionViewRef}
          style={styles.innerView}
          transition={transition}
        >
          {cloudComponents}
        </Transitioning.View>
      ) : (
        <View style={styles.innerView}>{cloudComponents}</View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  innerView: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    gap: 7,
  },
  synonymScrollContainer: {
    flexGrow: 1,
    columnGap: 100,
    margin: 5,
  },
});

//keeps old correct normals
function rebuildNormals(
  clouds: SynonymCloud[],
  newColorMap: Map<string, string>,
  oldNormals: Map<string, ColorNormal>
) {
  const map = new Map<string, ColorNormal>();
  clouds.forEach((cloud) => {
    const oldNormal = oldNormals.get(cloud.name);
    const newNormal = new ColorNormal(cloud.GetWordNormal(), newColorMap);
    if (!newNormal.IsValid) return;
    map.set(
      cloud.name,
      oldNormal?.isEqualTo(newNormal) ? oldNormal : newNormal
    );
  });
  return map;
}

const transition = <Transition.Change durationMs={100} />;

const DEFAULT_TILE_LIMIT = 30;

export default SynonymList;
