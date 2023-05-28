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
            ...styles.view,
            height: rectHeight,
            width: rectWidth,
            backgroundColor: background,
          }}
        >
          <Canvas
            style={{ ...styles.canvas, width: rectWidth, height: rectHeight }}
          >
            <GradientRect
              colorNormal={colorNormal}
              rectHeight={rectHeight}
              rectWidth={rectWidth}
            />
          </Canvas>
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
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
  canvas: { flex: 1 },
  word: {
    fontSize: 20,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  touchOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default SynonymWord;
