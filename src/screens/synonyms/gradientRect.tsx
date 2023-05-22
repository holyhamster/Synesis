import {
  LinearGradient,
  Rect,
  mix,
  useSharedValueEffect,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import React, { FC, useMemo, useRef } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ColorNormal from "./data/colorNormal";

interface GradientRectProps {
  style?: StyleProp<ViewStyle>;
  colorNormal: ColorNormal;
  rectWidth: number;
  rectHeight: number;
}

//rectangle with animated color gradient
const GradientRect: FC<GradientRectProps> = ({
  style,
  colorNormal,
  rectWidth,
  rectHeight,
}) => {
  const colorsCurrent = useRef<string[]>([]);
  const colorsTarget = useRef<string[]>([]);

  //gradient positions are interpolated between start and end with the help of Progress value
  const posStart = useRef<number[]>([]);
  const posTarget = useRef<number[]>([]);
  const posProgress = useSharedValue(1);

  //called at the end of any animation to transfer target values to current values
  const finalizeAnimation = () => {
    [posStart.current, colorsTarget.current] = getNewAnimationState(
      posProgress.value,
      posStart.current,
      posTarget.current,
      colorsTarget.current
    );
  };

  //on colorNormal prop changing, start animation
  useMemo(() => {
    [posTarget.current, colorsTarget.current] = colorNormal.getGradientValues();

    //if componend doesnt have a gradient yet, assign values directly and skip animation
    if (posStart.current.length == 0) {
      posStart.current = Array.from(posTarget.current);
      colorsCurrent.current = Array.from(colorsTarget.current);
      return;
    }
    if (posProgress.value != 1) finalizeAnimation();

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
      () => runOnJS(finalizeAnimation)()
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

  return (
    <Rect x={0} y={0} width={rectWidth} height={rectHeight}>
      <LinearGradient
        start={vec(0, 0)}
        end={vec(rectWidth, 0)}
        colors={colorsCurrent.current}
        positions={posValue}
      />
    </Rect>
  );
};

//interpolate arrays of values, can be run on UI thread
function lerpArray(progress: number, start: number[], end: number[]) {
  "worklet";
  const result: number[] = [];
  for (let i = 0; i < end.length; i++)
    result.push(mix(progress, start[i], end[i]));
  return result;
}

//returns position and colors array according to current animation state
function getNewAnimationState(
  progress: number,
  start: number[],
  end: number[],
  colorTarget: string[]
): [pos: number[], colors: string[]] {
  const currentPos = lerpArray(progress, start, end);
  const currentColors = Array.from(colorTarget);
  //remove trailing 1s and corresponding colors
  while (currentPos.length > 1 && currentPos[currentPos.length - 2] === 1) {
    currentPos.pop();
    currentColors.pop();
  }
  return [currentPos, currentColors];
}

//fills arrays with trailing 1s until they're of equal length
function harmonizeArrays(array: Array<Array<number>>) {
  if (!array || array.length == 0) return;
  const maxLength = Math.max(...array.map((element) => element.length));
  array.forEach((element) => {
    while (element.length < maxLength) element?.push(1);
  });
}

//overlap old array with new values from new array
function updateArray<T>(oldArray: T[], newArray: T[]) {
  return newArray.length >= oldArray.length
    ? Array.from(newArray)
    : oldArray.map((color, i) => newArray[i] ?? color);
}

export default GradientRect;
