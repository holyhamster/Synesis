import { FC } from "react";
import {
  Button,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SynDefinition from "../../synDefinition";

interface WordListProps {
  synArray: SynDefinition[];
  style?: StyleProp<ViewStyle>;
  onWordPress: (word: string) => void;
  onClearButton: () => void;
}

/*List of selected words, removes a word if its pressed*/
const WordListView: FC<WordListProps> = ({
  synArray,
  onWordPress,
  onClearButton,
  style,
}) => {
  return (
    <>
      <View style={[styles.selectedContainer, style]}>
        <View style={styles.selectedList}>
          {synArray.map((synDef, index) => (
            <Button
              key={index}
              title={synDef.Word}
              color={synDef.Color}
              onPress={() => onWordPress(synDef.Word)}
            />
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
