import {
  LinearGradient,
  Rect,
  mix,
  useSharedValueEffect,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import React, { FC, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ColorNormal from "./colorNormal";
import { calculateAnimationTargets, trimAnimationArrays } from "./gradient";

interface GradientRectProps {
  style?: StyleProp<ViewStyle>;
  colorNormal: ColorNormal;
  rectWidth: number;
  rectHeight: number;
  animationLength?: number;
}

//rectangle with animated color gradient
const GradientRect: FC<GradientRectProps> = ({
  style,
  colorNormal,
  rectWidth,
  rectHeight,
  animationLength,
}) => {
  //reference to color gradient with ski's useValue hook for updating on UI thread
  const colors = useValue<string[]>([
    colorNormal[0].color ?? "white",
    colorNormal[0].color ?? "white",
  ]);

  //gradient positions are interpolated between start and end with the help of Progress value
  const posStart = useSharedValue<number[]>([0, 1]);
  const posEnd = useSharedValue<number[]>([0, 1]);
  const posProgress = useSharedValue(1);

  //on colorNormal prop changing, calculate starting and ending animation points and que it
  useEffect(() => {
    const [newPosEnd, newColorsEnd] = colorNormal.toGradientValues();
    if (newPosEnd.length < 2 || newColorsEnd.length < 2) return;

    if (animationLength == 0) {
      colors.current = newColorsEnd;
      posStart.value = newPosEnd;
      posEnd.value = newPosEnd;
      posValue.current = newPosEnd;
      posProgress.value = 1;
      return;
    }

    const newColorStart = colors.current;
    //if previous animation wasnt over, save current position as start point
    const newPosStart =
      posProgress.value == 1
        ? posEnd.value
        : lerpArray(posProgress.value, posStart.value, posEnd.value);
    //remove empty sequences from previous transitions
    trimAnimationArrays(newPosStart, newColorStart);

    [posStart.value, posEnd.value, colors.current] = calculateAnimationTargets(
      newPosStart,
      newPosEnd,
      newColorStart,
      newColorsEnd
    );

    //reset interpolating value and start animation
    posProgress.value = 0;
    posProgress.value = withTiming(1, {
      duration: isNaN(animationLength) ? 1000 : animationLength,
    });
  }, [colorNormal]);

  //calculate new gradient values on UI thread
  const derivedPos = useDerivedValue(() => {
    return lerpArray(posProgress.value, posStart.value, posEnd.value);
  });

  //get new gradient value from UI thread into skia animation value
  const posValue = useValue([]);
  useSharedValueEffect(() => {
    posValue.current = derivedPos.value;
  }, posProgress);

  return (
    <Rect x={0} y={0} width={rectWidth} height={rectHeight}>
      <LinearGradient
        start={vec(0, 0)}
        end={vec(rectWidth, 0)}
        colors={colors}
        positions={posValue}
      />
    </Rect>
  );
};

//interpolate arrays of values, can be run on UI thread
function lerpArray(progress: number, start: number[], end: number[]) {
  "worklet";
  const result: number[] = [];
  const ln = end.length;
  for (let i = 0; i < ln; i++) result.push(mix(progress, start[i], end[i]));
  return result;
}

export default GradientRect;
