import React, { FC, memo, useRef, useState } from "react";
import { Canvas, useTouchHandler } from "@shopify/react-native-skia";
import {
  StyleProp,
  View,
  Text,
  TextStyle,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import ColorNormal from "./gradient/colorNormal";
import GradientRect from "./gradient/gradientRect";

interface SynonymWordProps {
  style?: StyleProp<TextStyle>;
  word: string;
  colorNormal: ColorNormal;
  onPress: () => void;
}

//pressable tile with a word and a color gradient
const SynonymWord: FC<SynonymWordProps> = memo(
  ({ colorNormal, word, onPress }) => {
    const rectWidth = Math.max(
      styles.word.fontSize * Math.max(word.length, 1) - 40,
      20
    );
    const rectHeight = 25;

    //tracks if the touch started and ended inside the area and calls onPress
    const [highlighted, setHighlighted] = useState(false);
    const [wasPressed, setPressed] = useState(false);

    let background = "white";
    let backgroundColorValue = 0;
    for (let i = 0; i < colorNormal.length; i++)
      if (colorNormal[i].value > backgroundColorValue)
        background = colorNormal[i].color;
    //background = "transparent"; //HERE
    const highlightOpacity = highlighted && !wasPressed ? 0.5 : 0;
    return (
      <TouchableHighlight
        onPress={() => {
          setPressed(true);
          onPress();
        }}
        onHideUnderlay={() => setHighlighted(false)}
        onShowUnderlay={() => setHighlighted(true)}
      >
        <View
          style={{
            ...styles.container,
            //backgroundColor: background,
          }}
        >
          <GradientRect
            colorNormal={colorNormal}
            rectHeight={rectHeight}
            rectWidth={rectWidth}
          />

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
