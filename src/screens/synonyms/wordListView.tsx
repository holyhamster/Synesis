import { FC } from "react";
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
import SynonymCollection from "./data/synonymCollection";

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
  //todo: add haptic feedback to long press with react-native-haptic-feedback
  return (
    <>
      <View style={[styles.selectedContainer, style]}>
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
              <Text style={{ margin: 5 }}>{synDef.Word}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.selectedClearButton}>
          <TouchableOpacity
            onPress={onClearButton}
            disabled={synArray.length == 0}
          >
            <View style={{ alignItems: "center" }}>
              <MaterialIcons name="clear" size={32} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  selectedContainer: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "orange",
  },
  selectedList: {
    flex: 4,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    alignSelf: "stretch",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    gap: 5,
    backgroundColor: "yellow",
  },
  selectedClearButton: {
    flex: 1,
    backgroundColor: "yellow",
  },
});

export default WordListView;
