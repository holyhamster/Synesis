import React, { FC, useEffect, useMemo } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ViewProps, ViewStyle } from "react-native";
import { RectangleTransition } from "./rectangleTransition";

interface RectProps {
  transition: RectangleTransition;
  dataKey: string;
  animationProgress: SharedValue<number>;
  style?: ViewProps;
  debugMessages?: boolean;
  registerTransitionUpdates?: (
    id: string,
    val: (RectangleTransition) => void
  ) => void;
}

//Views animated to lerp size according to transition and progressValue
const AnimatedRect: FC<RectProps> = ({
  animationProgress,
  transition,
  style,
  dataKey,
  registerTransitionUpdates,
}) => {
  const transitionRef = useSharedValue<RectangleTransition>(transition);

  useEffect(() => {
    const updateTransition = (newTransition: RectangleTransition) =>
      (transitionRef.value = newTransition);
    registerTransitionUpdates?.(dataKey, updateTransition);
  }, [dataKey, registerTransitionUpdates]);

  const staticStyle: Animated.AnimateStyle<ViewStyle> = useMemo(
    () => ({
      position: "absolute",
      ...style,
    }),
    [style]
  );

  //runs on the UI threat every time animation progress changes
  const animatedStyle =
    useAnimatedStyle((): Animated.AnimateStyle<ViewStyle> => {
      const { start, end } = transitionRef.value;
      const { value } = animationProgress;
      return {
        ...staticStyle,
        left: lerpWorklet(value, start.left, end.left),
        bottom: lerpWorklet(value, start.bottom, end.bottom),
        width: lerpWorklet(value, start.width, end.width),
        height: lerpWorklet(value, start.height, end.height),
        backgroundColor: end.color,
      };
    }, [animationProgress]);

  return <Animated.View style={animatedStyle} />;
};

//interpolates arrays of values on a UI thread
function lerpWorklet(progress: number, start: number, end: number) {
  "worklet";
  return (1 - progress) * start + progress * end;
}

export default AnimatedRect;
