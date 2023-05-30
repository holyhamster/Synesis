import React, { FC } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { UIGrey } from "../../colors";

interface WordInputProps {
  inputRef: React.RefObject<TextInput>;
  onAddWord: (word: string) => void;
}

const WordInputField: FC<WordInputProps> = ({ onAddWord, inputRef }) => {
  const [inputText, setInputText] = React.useState<string>("");

  const onSubmitEditing = (newText: string) => {
    onAddWord(newText);
    setInputText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputHolder}>
        <TextInput
          style={styles.inputText}
          ref={inputRef}
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
      <TouchableOpacity
        style={styles.inputButton}
        onPress={() => {
          if (inputText != "") onSubmitEditing(inputText);
        }}
        disabled={inputText === ""}
      >
        <MaterialIcons name="add" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputButton: {
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 5,
    backgroundColor: UIGrey,
  },
  container: {
    flex: 1,
    marginVertical: 10,
    flexDirection: "row",
  },
  inputHolder: {
    flex: 5,
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: UIGrey,
  },
  inputText: {
    fontSize: 20,
  },
});

export default WordInputField;
