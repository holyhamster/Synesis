import React, { FC, memo, useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";

import ColorNormal from "./gradient/colorNormal";
import GradientRect from "./gradient/gradientRect";

interface SynonymWordProps {
  word: string;
  colorNormal: ColorNormal;
  onPress: (word: string) => void;
}

//pressable tile with a word and a color gradient
const SynonymWord: FC<SynonymWordProps> = memo(
  ({ colorNormal, word, onPress }) => {
    //console.log("synWord", word);

    //tracks when touch started and ended to display a view with opacity on top
    const [highlighted, setHighlighted] = useState(false);

    let background = colorNormal?.getDominantColor() ?? "white";

    const highlightOpacity = highlighted ? 0.5 : 0;

    return (
      <TouchableHighlight
        onPress={() => {
          onPress(word);
        }}
        onHideUnderlay={() => setHighlighted(false)}
        onShowUnderlay={() => setHighlighted(true)}
      >
        <View
          style={{
            ...styles.container,
            backgroundColor: background,
          }}
        >
          <GradientRect colorNormal={colorNormal} />

          <View
            style={{
              ...styles.touchOverlay,
              opacity: highlightOpacity,
            }}
          />
          <Text style={styles.word}>{word}</Text>
        </View>
      </TouchableHighlight>
    );
  }
);

const styles = StyleSheet.create({
  container: {},
  word: {
    flex: 1,
    margin: 5,
    marginHorizontal: 10,
    fontSize: 20,
  },
  touchOverlay: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    right: 0,
    opacity: 0.1,
    backgroundColor: "white",
  },
});

export default SynonymWord;
