import React, { FC, useEffect, useRef, useState } from "react";
import {
  DeviceEventEmitter,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
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
import {
  GetStringFromStorage,
  StringTypesEnum,
} from "../../dictionaries/storageHandling";

interface SynonymListProps {
  synonyms: SynonymCollection[];
  colorMap: Map<string, string>;
  wordToSortBy?: string;
  addNewWord: (newWord: string) => void;
  addAndHiglight: (newWord: string) => void;
  showTooltip?: (text: string) => void;
  style?: ViewStyle;
}
//Takes synonyms, builds clouds of words and displays them in a ScrollList
const SynonymList: FC<SynonymListProps> = ({
  synonyms,
  colorMap,
  wordToSortBy,
  addNewWord,
  addAndHiglight,
  showTooltip,
  style,
}) => {
  //use layout transition for tile movement (supported only on android)
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
  useEffect(() => {
    setColorNormals((previous) => rebuildNormals(clouds, colorMap, previous));
  }, [clouds, colorMap]);

  //get tileLimit value out of memory
  const [tileLimit, setTileLimit] = useState(DEFAULT_TILE_LIMIT);
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.TileCountChanged,
      () =>
        GetStringFromStorage(StringTypesEnum.TileCount).then((value) =>
          setTileLimit(parseInt(value) ?? DEFAULT_TILE_LIMIT)
        )
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const hiddenCount = Math.max(clouds.length - tileLimit, 0);
    const toolTipText = hiddenCount == 0 ? "" : `Hidden: ${hiddenCount}`;
    showTooltip?.(toolTipText);
  }, [showTooltip, tileLimit, clouds]);

  const styleWord = React.useMemo(
    () => ({ zIndex: (style?.zIndex ?? 0) + 1 }),
    [style?.zIndex]
  );

  const cloudComponents = clouds
    .slice(-tileLimit)
    .map((cloud) => (
      <SynonymWord
        key={cloud.name}
        word={cloud.name}
        colorNormal={colorNormals.get(cloud.name)}
        onPress={addNewWord}
        onLongPress={addAndHiglight}
        style={styleWord}
      />
    ));

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ zIndex: style?.zIndex ?? 0 }}
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
    paddingVertical: 5,
  },
});

//compares old normal map with a new colormap, creates new normals when required
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
