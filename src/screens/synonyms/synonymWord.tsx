import React, { FC, memo, useMemo, useRef } from "react";
import {
  LinearGradient,
  Canvas,
  Rect,
  vec,
  mix,
  useSharedValueEffect,
  useValue,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { StyleProp, View, Text, TextStyle, StyleSheet } from "react-native";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ColorNormal from "./data/colorNormal";

// Create an animated component from LinearGradient
interface SynonymWordProps {
  style?: StyleProp<TextStyle>;
  word: string;
  colorNormal: ColorNormal;
  onPress: () => void;
}

const SynonymWord: FC<SynonymWordProps> = memo(
  ({ colorNormal, word, onPress }) => {
    const colorsCurrent = useRef<string[]>([]);
    const colorsTarget = useRef<string[]>([]);

    //gradient positions are interpolated between start and end with the help of Progress value
    const posStart = useRef<number[]>([]);
    const posTarget = useRef<number[]>([]);
    const posProgress = useSharedValue(1);

    const finalizedAnimationCall = () => {
      posStart.current = lerpArray(
        posProgress.value,
        posStart.current,
        posTarget.current
      );

      while (
        posStart.current.length > 1 &&
        posStart.current[posStart.current.length - 2] === 1
      ) {
        posStart.current.pop();
      }

      colorsCurrent.current = Array.from(colorsTarget.current);
      while (colorsCurrent.current.length > posStart.current.length)
        colorsCurrent.current.pop();
    };

    //on colorNormal prop changing, start animation
    useMemo(() => {
      [posTarget.current, colorsTarget.current] =
        colorNormal.getGradientValues();

      //if componend doesnt have a gradient yet, assign values directly and skip animation
      if (posStart.current.length == 0) {
        posStart.current = Array.from(posTarget.current);
        colorsCurrent.current = Array.from(colorsTarget.current);
        return;
      }
      if (posProgress.value != 1) finalizedAnimationCall();
      harmonizeArrays([posStart.current, posTarget.current]);
      colorsCurrent.current = updateArray(
        colorsCurrent.current,
        colorsTarget.current
      );

      posProgress.value = 0;
      posProgress.value = withTiming(
        1,
        {
          duration: 1000,
        },
        () => runOnJS(finalizedAnimationCall)()
      );
    }, [colorNormal]);

    //hook calculated on UI thread
    const derivedPos = useDerivedValue(() => {
      const val = lerpArray(
        posProgress.value,
        posStart.current,
        posTarget.current
      );
      return val;
    });

    const posValue = useValue([]);
    //synchronize skia animation value on JS thread
    useSharedValueEffect(() => {
      posValue.current = derivedPos.value;
    }, posProgress);

    const rectWidth = styles.word.fontSize * Math.max(word.length, 1) - 40;
    const rectHeight = 25;

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
          <Rect x={0} y={0} width={rectWidth} height={rectHeight}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(rectWidth, 0)}
              colors={colorsCurrent.current}
              positions={posValue}
            />
          </Rect>
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

function lerpArray(progress: number, start: number[], end: number[]) {
  "worklet";
  const result: number[] = [];
  for (let i = 0; i < end.length; i++)
    result.push(mix(progress, start[i], end[i]));
  return result;
}

function harmonizeArrays(array: Array<Array<number>>) {
  if (!array || array.length == 0) return;
  const maxLength = Math.max(...array.map((element) => element.length));
  array.forEach((element) => {
    while (element.length < maxLength) element?.push(1);
  });
}

function updateArray<T>(oldArray: T[], newArray: T[]) {
  return newArray.length >= oldArray.length
    ? Array.from(newArray)
    : oldArray.map((color, i) => newArray[i] ?? color);
}
export default SynonymWord;
