import React, { FC, memo, useRef } from "react";
import { Canvas, useTouchHandler } from "@shopify/react-native-skia";
import { StyleProp, View, Text, TextStyle, StyleSheet } from "react-native";

import ColorNormal from "./data/colorNormal";
import GradientRect from "./gradientRect";

interface SynonymWordProps {
  style?: StyleProp<TextStyle>;
  word: string;
  colorNormal: ColorNormal;
  onPress: () => void;
}

//pressable tile with a word and a color gradient
const SynonymWord: FC<SynonymWordProps> = memo(
  ({ colorNormal, word, onPress }) => {
    const rectWidth = styles.word.fontSize * Math.max(word.length, 1) - 40;
    const rectHeight = 25;

    //tracks if the touch started and ended inside the area and calls onPress
    const wasPressed = useRef(false);
    const touchHandler = useTouchHandler(
      {
        onStart: () => {
          wasPressed.current = true;
        },
        onEnd: (touchInfo) => {
          if (
            wasPressed.current &&
            touchInfo.x < rectWidth &&
            touchInfo.x > 0 &&
            touchInfo.y > 0 &&
            touchInfo.y < rectHeight
          )
            onPress();
          wasPressed.current = false;
        },
      },
      [onPress]
    );

    return (
      <View
        style={{
          ...styles.view,
          height: rectHeight,
          width: rectWidth,
          backgroundColor: colorNormal?.[0]?.color || "white",
        }}
      >
        <Canvas
          onTouch={touchHandler}
          style={{ flex: 1, width: rectWidth, height: rectHeight }}
        >
          <GradientRect
            colorNormal={colorNormal}
            rectHeight={rectHeight}
            rectWidth={rectWidth}
          />
        </Canvas>
        <Text style={styles.word}>{word}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
  word: {
    fontSize: 20,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SynonymWord;
