import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";

import SynonymWord from "./synonymWord";
import SynonymCollection from "../../dictionaries/data/synonymCollection";
import { EventsEnum } from "../../events";
import Storage, { StringTypesEnum } from "../../dictionaries/storageHandling";
import BackgroundImage from "./backgroundImage";
import { useClouds } from "../../dictionaries/data/useClouds";
import * as Colors from "../../colors";

interface SynonymListProps {
  synonyms: SynonymCollection[];
  colorMap: Map<string, string>;
  wordToSortBy?: string;
  addNewWord: (newWord: string) => void;
  style?: ViewStyle;
}

//Builds clouds of words from synonyms and displays them in a ScrollList
const SynonymList: FC<SynonymListProps> = ({
  synonyms,
  colorMap,
  wordToSortBy,
  addNewWord,
  style,
}) => {
  const isOnWeb = Platform.OS == "web";
  //load tile limit from memory and watch the event for its change
  const [cloudLimit, setCloudLimit] = useState(DEFAULT_CLOUD_LIMIT);
  useEffect(() => {
    const loadCloudLimit = () =>
      Storage.GetString(StringTypesEnum.CloudCount).then((value) => {
        const loaded = parseInt(value);
        !isNaN(loaded) && setCloudLimit(loaded);
      });

    loadCloudLimit();
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.CloudCountChanged,
      loadCloudLimit
    );
    return () => subscription.remove();
  }, []);

  //generate word clouds out of given synonyms
  const { clouds, colorNormals, displayInfo } = useClouds(
    synonyms,
    colorMap,
    wordToSortBy,
    cloudLimit
  );
  const showingHintText = `Showing: ${displayInfo.renderedCount}/${displayInfo.totalCount}`;

  //layout transition for tile movement (android only)
  const transitionViewRef = useRef<TransitioningView>();

  useEffect(() => {
    if (!isOnWeb) transitionViewRef.current?.animateNextTransition();
  }, [synonyms]);

  //create cloud components
  const zIndex = style?.zIndex ?? 0;
  const cloudComponents = [];
  for (const cloud of clouds) {
    if (!cloud) continue;
    const { name } = cloud;
    const normal = colorNormals.get(name);
    cloudComponents.push(
      <SynonymWord
        key={name}
        word={name}
        fontSize={FONT_SIZE}
        colorNormal={normal}
        onPress={addNewWord}
        style={{ zIndex: zIndex + 1 }}
      />
    );
  }

  //set flag for activity indicator
  const synonymsBeingFetched =
    synonyms.find((synonym) => !synonym.WasFetched) != null;
  const tilesAreRendering =
    displayInfo.renderedCount < displayInfo.totalCount &&
    displayInfo.renderedCount < cloudLimit;
  const loadingActive = synonymsBeingFetched || tilesAreRendering;

  return (
    <View style={{ flex: 1 }}>
      <BackgroundImage source={BACKGROUND_IMAGE} faded={clouds.length > 0} />
      <View style={styles.activityIndicator}>
        <ActivityIndicator
          pointerEvents="none"
          animating={loadingActive}
          size="large"
          color={Colors.CountourColor}
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ zIndex: zIndex }}
        contentContainerStyle={styles.synonymScrollContainer}
      >
        {isOnWeb ? (
          <View style={styles.innerView}>{cloudComponents}</View>
        ) : (
          <Transitioning.View
            ref={transitionViewRef}
            style={styles.innerView}
            transition={transition}
          >
            {cloudComponents}
          </Transitioning.View>
        )}
      </ScrollView>

      <View style={styles.tooltip} pointerEvents="none">
        <View style={{ ...styles.tooltipBackground, zIndex: zIndex + 10 }} />
        <Text style={{ ...styles.tooltipText, zIndex: zIndex + 11 }}>
          {showingHintText}
        </Text>
      </View>
    </View>
  );
};

const IS_ON_MOBILE = Platform.OS != "web";
const FONT_SIZE: number = IS_ON_MOBILE ? 20 : 30;
const DEFAULT_CLOUD_LIMIT: number = IS_ON_MOBILE ? 40 : 70;
const BACKGROUND_IMAGE = require("../../../assets/icon.png");

const styles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    zIndex: 1,
  },

  innerView: {
    flex: 1,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: FONT_SIZE * 0.7,
    margin: 10,
  },

  synonymScrollContainer: {
    margin: 5,
    marginBottom: 50,
  },

  tooltip: {
    position: "absolute",
    left: 5,
    bottom: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  tooltipBackground: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 15,
    position: "absolute",
    backgroundColor: Colors.BGWhite,
    opacity: 0.7,
  },
  tooltipText: { margin: 7 },
});

const transition = <Transition.Change durationMs={100} />;

export default SynonymList;
