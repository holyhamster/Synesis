import React, { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SynonymCollection from "../../dictionaries/data/synonymCollection";
import * as Colors from "../../colors";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import MaterialButton from "../materialButton";

interface WordListProps {
  synonymArray: SynonymCollection[];
  selectedSynonym: string;
  onWordPress: (word: string) => void;
  onLongPress: (word: string) => void;
  onClearButton: () => void;
}

/*List of selected words, calls input events on presses*/
const WordListView: FC<WordListProps> = ({
  synonymArray: synArray,
  selectedSynonym,
  onWordPress,
  onLongPress,
  onClearButton,
}) => {
  React.useEffect(() => {
    transRef.current.animateNextTransition();
  }, [synArray]);
  const transRef = React.useRef<TransitioningView>();
  //todo: add haptic feedback to long press with react-native-haptic-feedback
  return (
    <Transitioning.View
      style={styles.container}
      transition={transition}
      ref={transRef}
    >
      <View style={styles.list}>
        {synArray.map((synDef, index) => (
          <Pressable
            key={index}
            android_ripple={{
              color: "white",
            }}
            style={{
              backgroundColor: synDef.Color,
              ...(synDef.Word == selectedSynonym ? styles.selected : []),
            }}
            onPress={() => onWordPress(synDef.Word)}
            onLongPress={() => {
              onLongPress(synDef.Word);
              Haptics.selectionAsync();
            }}
          >
            <Text style={styles.text}>{synDef.Word}</Text>
          </Pressable>
        ))}
      </View>

      <MaterialButton
        disabled={synArray.length == 0}
        name="clear"
        onPress={onClearButton}
        style={{
          backgroundColor: Colors.BGWhite,
          disabledCountourColor: Colors.DisabledGrey,
          countourColor: Colors.CountourColor,
        }}
      />
    </Transitioning.View>
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
  selected: {
    borderWidth: 3,
    borderColor: Colors.CountourColor,
    margin: -3,
  },
});

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={500} />
    <Transition.Out type="fade" durationMs={500} />
  </Transition.Together>
);

export default WordListView;
