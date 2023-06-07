import React, { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SynonymCollection from "../../dictionaries/data/synonymCollection";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import MaterialButton from "../materialButton";
import * as Colors from "../../colors";

//UI element listing selected synonyms
interface WordListProps {
  synonymArray: SynonymCollection[];
  highlighted: string;
  onWordPress: (word: string) => void;
  onLongPress: (word: string) => void;
  onClearButton: () => void;
}

const WordListView: FC<WordListProps> = ({
  synonymArray,
  highlighted,
  onWordPress,
  onLongPress,
  onClearButton,
}) => {
  const transitionReference = React.useRef<TransitioningView>();

  React.useEffect(() => {
    transitionReference.current.animateNextTransition();
  }, [synonymArray]);

  return (
    <Transitioning.View
      style={styles.container}
      transition={transition}
      ref={transitionReference}
    >
      <View style={styles.list}>
        {synonymArray.map((synDef, index) => (
          <Pressable
            key={index}
            android_ripple={{
              color: Colors.BGWhite,
            }}
            style={{
              backgroundColor: synDef.Color,
              ...(synDef.Word == highlighted ? styles.highlighted : []),
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
        disabled={synonymArray.length == 0}
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

  highlighted: {
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
