import React, { FC } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import SynonymCollection from "../../dictionaries/data/synonymCollection";
import Animated, {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import MaterialButton from "../materialButton";
import * as Colors from "../../colors";

const anim = Animated.createAnimatedComponent(View);
//UI element listing selected synonyms
interface WordListProps {
  synonymArray: SynonymCollection[];
  colorMap: Map<string, string>;
  highlighted: string;
  onPress: (word: string) => void;
  onLongPress: (word: string) => void;
  onClearButton: () => void;
}

const WordListView: FC<WordListProps> = ({
  synonymArray,
  colorMap,
  highlighted,
  onPress,
  onLongPress,
  onClearButton,
}) => {
  const transitionReference = React.useRef<TransitioningView>();

  React.useEffect(() => {
    if (Platform.OS == "android")
      transitionReference.current.animateNextTransition();
  }, [synonymArray]);

  const wordsComponents = synonymArray.map(({ Word, IsEmpty, WasFetched }) => {
    const OVERRIDE_COLOR = !WasFetched || IsEmpty || !colorMap.has(Word);
    const color = OVERRIDE_COLOR ? Colors.DisabledGrey : colorMap.get(Word);
    const highlightedStyle = Word == highlighted ? styles.highlighted : [];
    const getStyle = (pressed: boolean) => ({
      backgroundColor: color,
      ...highlightedStyle,
      opacity: Platform.OS != "android" && pressed ? 0.6 : 1,
    });
    return (
      <Pressable
        key={Word}
        android_ripple={{
          color: Colors.BGWhite,
        }}
        style={({ pressed }) => getStyle(pressed)}
        onPress={() => onPress(Word)}
        onLongPress={() => {
          onLongPress(Word);
          if (Platform.OS == "android") Haptics.selectionAsync();
        }}
      >
        <Text style={styles.text}>{Word}</Text>
      </Pressable>
    );
  });

  return (
    <View style={styles.container}>
      {Platform.OS == "android" ? (
        <Transitioning.View
          style={styles.list}
          transition={transition}
          ref={transitionReference}
        >
          {wordsComponents}
        </Transitioning.View>
      ) : (
        <View style={styles.list}>{wordsComponents}</View>
      )}

      <MaterialButton
        disabled={synonymArray.length == 0}
        name="clear"
        onPress={onClearButton}
        style={{
          backgroundColor: Colors.BGWhite,
          disabledCountourColor: Colors.DisabledGrey,
          countourColor: Colors.CountourColor,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: { fontSize: 20, marginHorizontal: 7, marginVertical: 5 },
  container: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  list: {
    flex: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignSelf: "stretch",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    gap: 5,
  },

  highlighted: {
    borderWidth: 3,
    borderColor: Colors.CountourColor,
    margin: -3,
  },
});

const transition = (
  <Transition.Together>
    <Transition.Change durationMs={200} />
  </Transition.Together>
);

export default WordListView;
