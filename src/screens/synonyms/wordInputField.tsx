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

  const { inputStyle, inputAddButton, inputField, inputContainer } =
    StyleSheet.create({
      inputAddButton: {
        flex: 1,
        backgroundColor: "blue",
      },
      inputField: {
        flex: 5,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
      },
      inputStyle: {
        borderWidth: 1,
      },
      inputContainer: {
        flex: 1,
        backgroundColor: "pink",
        marginVertical: 10,
        flexDirection: "row",
      },
    });

  return (
    <View style={inputContainer}>
      <View style={inputField}>
        <TextInput
          style={inputStyle}
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
export default WordInputField;
