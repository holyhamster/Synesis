import React, { FC } from "react";
import {
  Button,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SynonymCollection from "../../dictionaries/data/synonymCollection";
import { UIGrey } from "../../colors";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";

interface WordListProps {
  synArray: SynonymCollection[];
  style?: StyleProp<ViewStyle>;
  onWordPress: (word: string) => void;
  onLongPress: (word: string) => void;
  onClearButton: () => void;
}

/*List of selected words, calls input events on presses*/
const WordListView: FC<WordListProps> = ({
  synArray,
  onWordPress,
  onLongPress,
  onClearButton,
  style,
}) => {
  React.useEffect(() => {
    transRef.current.animateNextTransition();
  }, [synArray]);
  const transRef = React.useRef<TransitioningView>();
  //todo: add haptic feedback to long press with react-native-haptic-feedback
  return (
    <>
      <Transitioning.View
        style={[styles.selectedContainer, style]}
        transition={transition}
        ref={transRef}
      >
        <View style={styles.selectedList}>
          {synArray.map((synDef, index) => (
            <Pressable
              key={index}
              android_ripple={{
                color: "white",
              }}
              style={{ backgroundColor: synDef.Color }}
              onPress={() => onWordPress(synDef.Word)}
              onLongPress={() => onLongPress(synDef.Word)}
            >
              <Text style={styles.text}>{synDef.Word}</Text>
            </Pressable>
          ))}
        </View>

        <TouchableOpacity
          style={styles.selectedClearButton}
          onPress={onClearButton}
          disabled={synArray.length == 0}
        >
          <MaterialIcons name="clear" size={40} color="black" />
        </TouchableOpacity>
      </Transitioning.View>
    </>
  );
};

const styles = StyleSheet.create({
  text: { fontSize: 20, marginHorizontal: 7, marginVertical: 5 },
  selectedContainer: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  selectedList: {
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
  selectedClearButton: {
    backgroundColor: UIGrey,
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 5,
  },
});

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={500} />
    <Transition.Out type="fade" durationMs={500} />
  </Transition.Together>
);

export default WordListView;
