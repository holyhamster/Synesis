import React, { FC } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { BGWhite, CountourColor, DisabledGrey } from "../../colors";
import MaterialButton from "../materialButton";

interface WordInputProps {
  onAddWord: (word: string) => void;
}

const WordInputField: FC<WordInputProps> = ({ onAddWord }) => {
  const [inputText, setInputText] = React.useState<string>("");

  const onSubmitEditing = (newText: string) => {
    onAddWord(newText);
    setInputText("");
  };
  const inputButtonDisabled = inputText === "";

  return (
    <View style={styles.container}>
      <View style={styles.inputHolder}>
        <TextInput
          style={styles.inputText}
          autoFocus={true}
          placeholder=" enter a new word"
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
        style={{
          backgroundColor: BGWhite,
          disabledCountourColor: DisabledGrey,
          countourColor: CountourColor,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  inputHolder: {
    flex: 5,
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BGWhite,
  },
  inputText: {
    fontSize: 20,
  },
});

export default WordInputField;
