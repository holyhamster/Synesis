import React, { FC } from "react";
import { TextInput, StyleSheet, View, Button } from "react-native";

interface WordInputProps {
  onAddWord: (word: string) => void;
}

const WordInputField: FC<WordInputProps> = ({ onAddWord }) => {
  const [inputText, setInputText] = React.useState<string>("");

  const inputRef = React.useRef(null);

  const onSubmitEditing = (newText: string) => {
    onAddWord(newText);
    setInputText("");
    inputRef.current.focus();
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

      <View style={inputAddButton}>
        <Button
          disabled={inputText === ""}
          title={"add"}
          onPress={() => {
            if (inputText != "") onSubmitEditing(inputText);
          }}
        ></Button>
      </View>
    </View>
  );
};
export default WordInputField;
