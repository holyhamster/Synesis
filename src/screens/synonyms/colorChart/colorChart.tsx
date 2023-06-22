import React, { FC, useCallback, useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import ColorNormal from "./colorNormal";
import AnimatedRect from "./animatedRectangle";
import {
  AlignRectangles as AlignRectangles,
  LerpRectangles as LerpRectangles,
} from "./rectangle";
import { GetTransitionsKeys, RectangleTransition } from "./rectangleTransition";
import { useValueSynchronizer } from "../../../useValueSynchronizer";

interface ColorChartProps {
  colorNormal: ColorNormal;
  animationLength?: number;
  size: { height: number; width: number };
  style?: ViewStyle;
}

//Takes in a ColorNormal, draws a rectangle chart with sharp gradients according to it
//if passed a new ColorNormal, will animate transition to it
const ColorChart: FC<ColorChartProps> = ({
  colorNormal,
  animationLength,
  size,
  style,
}) => {
  const {
    registerSetter,
    keys,
    setArray: setTransitions,
    array: transitions,
  } = useValueSynchronizer<RectangleTransition>(GetTransitionsKeys);

  const animationProgress = useSharedValue(1);
  const restartAnimation = useCallback(() => {
    const duration = isNaN(animationLength)
      ? DEFAULT_ANIMATION_LENGTH
      : animationLength;
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, {
      duration: duration,
    });
  }, [animationLength]);

  //calculate starting and ending animation rectangles and start animation
  useEffect(() => {
    if (!colorNormal?.IsValid) return;
    //get current rectangles according to animation progress
    const currentRects = transitions
      .map(({ start, end }) =>
        LerpRectangles(animationProgress.value, start, end)
      )
      .filter((rect) => rect.width != 0);

    //calculate new start and end between current
    const normalRectangles = colorNormal.ToGradient().ToRectangle(size);
    const [newStart, newTarget] = AlignRectangles(
      currentRects,
      normalRectangles
    );

    const newRects = newStart.map((_, index) => ({
      start: newStart[index],
      end: newTarget[index],
    }));

    setTransitions(newRects, (previous) => {
      if (!previous.length) return;
      restartAnimation();
    });
  }, [colorNormal, size, setTransitions]);

  return (
    <View style={[styles.view, style]}>
      {Array.from(keys.keys()).map((id) => (
        <AnimatedRect
          transition={keys.get(id)}
          dataKey={id}
          key={id}
          animationProgress={animationProgress}
          registerTransitionUpdates={registerSetter}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

const DEFAULT_ANIMATION_LENGTH = 1000;

export default ColorChart;
