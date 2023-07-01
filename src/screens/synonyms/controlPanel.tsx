import React, { FC } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import SynonymCollection from "../../dictionaries/data/synonymCollection";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import MaterialButton, { MaterialButtonStyle } from "../materialButton";
import * as Colors from "../../colors";

//UI element listing selected synonyms
interface ControlPanelProps {
  synonyms: SynonymCollection[];
  colorMap: Map<string, string>;
  highlightedWord: string;
  onWordPress: (word: string) => void;
  onWordLongPress: (word: string) => void;
  onClearButton: () => void;
  onOptions: () => void;
  onAddWord: (word: string) => void;
}

const ControlPanelView: FC<ControlPanelProps> = ({
  synonyms,
  colorMap,
  highlightedWord,
  onWordPress,
  onWordLongPress,
  onClearButton,
  onOptions,
  onAddWord,
}) => {
  const transitionReference = React.useRef<TransitioningView>();
  const isOnMobile = Platform.OS != "web";

  React.useEffect(() => {
    isOnMobile && transitionReference.current.animateNextTransition();
  }, [synonyms]);

  const wordListComponents = synonyms.map(({ Word, IsEmpty, WasFetched }) => {
    const overrideColor = !WasFetched || IsEmpty || !colorMap.has(Word);
    const wordColor = overrideColor ? Colors.DisabledGrey : colorMap.get(Word);
    const getWordStyle = (pressed: boolean) => ({
      backgroundColor: wordColor,
      ...(Word == highlightedWord ? styles.highlightedWord : []),
      opacity: !isOnMobile && pressed ? 0.6 : 1,
    });
    return (
      <Pressable
        key={Word}
        android_ripple={{
          color: Colors.BGWhite,
        }}
        style={({ pressed }) => getWordStyle(pressed)}
        onPress={() => onWordPress(Word)}
        onLongPress={() => {
          onWordLongPress(Word);
          if (isOnMobile) Haptics.selectionAsync();
        }}
      >
        <Text style={styles.text}>{Word}</Text>
      </Pressable>
    );
  });

  const [inputText, setInputText] = React.useState<string>("");
  const onSubmitEditing = (newText: string) => {
    onAddWord(newText);
    setInputText("");
  };
  const inputButtonDisabled = inputText === "";

  return (
    <View>
      <View style={styles.listContainer}>
        <View style={{ alignSelf: "flex-end" }}>
          <MaterialButton
            name="settings"
            onPress={onOptions}
            style={styles.materialButtonStyle}
          />
        </View>
        {isOnMobile ? (
          <Transitioning.View
            style={styles.wordList}
            transition={transition}
            ref={transitionReference}
          >
            {wordListComponents}
          </Transitioning.View>
        ) : (
          <View style={styles.wordList}>{wordListComponents}</View>
        )}
      </View>
      <View style={styles.inputContainer}>
        <MaterialButton
          disabled={synonyms.length == 0}
          name="clear"
          onPress={onClearButton}
          style={styles.materialButtonStyle}
        />
        <View style={styles.inputHolder}>
          <TextInput
            style={styles.inputText}
            autoFocus={true}
            blurOnSubmit={true}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
            }}
            onSubmitEditing={(event) => {
              const newText = event.nativeEvent.text;
              if (newText) onSubmitEditing(newText);
            }}
          />
        </View>
        <MaterialButton
          disabled={inputButtonDisabled}
          name="add"
          onPress={() => onSubmitEditing(inputText)}
          style={styles.materialButtonStyle}
        />
      </View>
    </View>
  );
};

interface ControlPanelStyles {
  text: ViewStyle;
  listContainer: ViewStyle;
  inputHolder: ViewStyle;
  inputText: TextStyle;
  inputContainer: ViewStyle;
  wordList: ViewStyle;
  highlightedWord: ViewStyle;
  materialButtonStyle: MaterialButtonStyle;
}

const styles = StyleSheet.create<ControlPanelStyles>({
  text: { fontSize: 20, marginHorizontal: 7, marginVertical: 5 },
  listContainer: {
    flexDirection: "row",
  },
  inputHolder: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BGWhite,
  },
  inputText: {
    fontSize: 20,
    width: "95%",
    textAlign: "center",
  },
  inputContainer: {
    paddingVertical: 5,
    flexDirection: "row",
  },
  wordList: {
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

  highlightedWord: {
    borderWidth: 3,
    borderColor: Colors.CountourColor,
    margin: -3,
  },
  materialButtonStyle: {
    backgroundColor: Colors.BGWhite,
    disabledCountourColor: Colors.DisabledGrey,
    countourColor: Colors.CountourColor,
  },
});

const transition = (
  <Transition.Together>
    <Transition.Change durationMs={200} />
  </Transition.Together>
);

export default ControlPanelView;
