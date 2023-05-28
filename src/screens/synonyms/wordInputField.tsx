import React, { FC } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
    <View style={styles.inputContainer}>
      <View style={styles.inputField}>
        <TextInput
          style={styles.inputText}
          ref={inputRef}
          autoFocus={true}
          placeholder="enter a new word"
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
        onPress={() => {
          if (inputText != "") onSubmitEditing(inputText);
        }}
        disabled={inputText === ""}
      >
        <View style={{ alignItems: "center" }}>
          <MaterialIcons name="add" size={32} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    borderWidth: 1,
  },
  inputContainer: {
    flex: 1,
    marginVertical: 10,
    flexDirection: "row",
  },
});

export default WordInputField;
