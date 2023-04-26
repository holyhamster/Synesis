import React, { FC } from "react";
import { TextInput, StyleSheet, Button } from "react-native";

interface WordInputProps {
  onAddWord: (word: string) => void;
}

const WordInputField: FC<WordInputProps> = ({ onAddWord }) => {
  const [inputText, setInputText] = React.useState<string>("");

  const inputRef = React.useRef(null);

  const onSubmitEditing = (event: any) => {
    const newText = event.nativeEvent.text;
    if (!newText) return;
    onAddWord(newText);
    setInputText("");
    inputRef.current.focus();
  };

  const { inputStyle } = StyleSheet.create({
    inputStyle: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });

  return (
    <TextInput
      style={inputStyle}
      ref={inputRef}
      autoFocus={true}
      placeholder="enter a new word"
      blurOnSubmit={true}
      value={inputText}
      onChangeText={(text) => setInputText(text)}
      onSubmitEditing={onSubmitEditing}
    />
  );
};
export default WordInputField;
