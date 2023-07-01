import React, { FC, useEffect, useRef, useState } from "react";
import {
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
  addAndHiglight: (newWord: string) => void;
  style?: ViewStyle;
}
//Builds clouds of words from synonyms and displays them in a ScrollList
const SynonymList: FC<SynonymListProps> = ({
  synonyms,
  colorMap,
  wordToSortBy,
  addNewWord,
  addAndHiglight,
  style,
}) => {
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

  //layout transition for tile movement (only on android)
  const transitionViewRef = useRef<TransitioningView>();
  const animateTransition = () => {
    if (Platform.OS == "android")
      transitionViewRef.current?.animateNextTransition();
  };

  useEffect(() => {
    animateTransition();
  }, [synonyms]);

  //create cloud components
  const zIndex = style?.zIndex ?? 0;
  const cloudComponents = [];
  for (let i = 0; i < clouds.length; i++) {
    if (!clouds[i]) continue;
    const { name } = clouds[i];
    const normal = colorNormals.get(name);
    cloudComponents.push(
      <SynonymWord
        key={name}
        word={name}
        colorNormal={normal}
        onPress={addNewWord}
        onLongPress={addAndHiglight}
        style={{ zIndex: zIndex + 1 }}
      />
    );
  }

  const { totalCount, renderedCount } = displayInfo;
  const tooltip = `Showing: ${renderedCount}/${totalCount}`;
  return (
    <View style={{ flex: 1 }}>
      <BackgroundImage source={BACKGROUND_IMAGE} faded={clouds.length > 0} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ zIndex: zIndex }}
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

      {tooltip != "" && (
        <View style={styles.tooltip} pointerEvents="none">
          <View style={{ ...styles.tooltipBackground, zIndex: zIndex + 10 }} />
          <Text style={{ ...styles.tooltipText, zIndex: zIndex + 11 }}>
            {tooltip}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  innerView: {
    flex: 1,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 15,
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

const DEFAULT_CLOUD_LIMIT = 30;
const BACKGROUND_IMAGE = require("../../../assets/icon.png");
export default SynonymList;
