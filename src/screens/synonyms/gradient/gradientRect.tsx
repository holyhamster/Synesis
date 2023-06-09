import React, { FC, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  LinearGradient,
  Rect,
  SkSize,
  mix,
  useComputedValue,
  useSharedValueEffect,
  useValue,
  useValueEffect,
  vec,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ColorNormal from "./colorNormal";
import { calculateAnimationTargets, trimAnimationArrays } from "./gradient";

interface GradientRectProps {
  colorNormal: ColorNormal;
  animationLength?: number;
  size?: { height: number; width: number };
}

//Takes in a Color normal in ["red":0.5, "blue":0.5] form, animates transition to it
//if height
const GradientRect: FC<GradientRectProps> = ({
  colorNormal,
  animationLength,
  size,
}) => {
  //console.log("rect", debugName, colorNormal);

  const background = useRef(getDominantBackground(colorNormal));
  //reference to color gradient with ski's useValue hook for updating on UI thread
  const colors = useValue<string[]>([]);

  //gradient positions are interpolated between start and end with the help of Progress value
  const posStart = useSharedValue<number[]>([]);
  const posEnd = useSharedValue<number[]>([]);
  const posProgress = useSharedValue(1);

  //on colorNormal prop changing, calculate starting and ending animation points and que it
  useEffect(() => {
    background.current = getDominantBackground(colorNormal);
    if (!colorNormal?.IsValid) return;
    const [newPosEnd, newColorsEnd] = colorNormal.toGradientValues();
    if (newPosEnd.length < 2 || newColorsEnd.length < 2) return;

    const setAnimationToEndState = () => {
      colors.current = newColorsEnd;
      posEnd.value = newPosEnd;
      posProgress.value = 1;
    };

    if (animationLength == 0) {
      setAnimationToEndState();
      return;
    }

    const newColorStart = colors.current;
    //if previous animation wasnt over, save current position as start point
    const newPosStart =
      posProgress.value == 1
        ? posEnd.value
        : lerpArray(posProgress.value, posStart.value, posEnd.value);
    //remove empty sequences from previous transitions
    try {
      trimAnimationArrays(newPosStart, newColorStart);

      [posStart.value, posEnd.value, colors.current] =
        calculateAnimationTargets(
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
    } catch {
      setAnimationToEndState();
    }
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

  const rectWidth = useValue(size?.width || 0);
  const rectHeight = useValue(size?.height || 0);
  const gradientEnd = useComputedValue(
    () => vec(rectWidth.current, 0),
    [rectWidth]
  );

  //gets set by canvas onSize event, on change sets rectWidth and rectHeight
  const canvasSize = useValue<SkSize>({
    height: size?.height || 0,
    width: size?.width || 0,
  });

  useValueEffect(canvasSize, (v) => {
    console.log("here");
    rectWidth.current = v.width;
    rectHeight.current = v.height;
  });

  const styles = StyleSheet.create({
    canvas: {
      position: "absolute",
      width: size ? size.width : "100%",
      height: size ? size.height : "100%",
    },
  });

  return (
    <Canvas style={{ ...styles.canvas }} onSize={size ? undefined : canvasSize}>
      <Rect x={0} y={0} width={rectWidth} height={rectHeight}>
        <LinearGradient
          start={vec(0, 0)}
          end={gradientEnd}
          colors={colors}
          positions={posValue}
        />
      </Rect>
    </Canvas>
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

const getDominantBackground = (normal: ColorNormal) => {
  let backgroundColorValue = 0;
  let ibackground = "white";

  normal?.forEach((pair) => {
    if (pair.value > backgroundColorValue) {
      ibackground = pair.color;
      backgroundColorValue = pair.value;
    }
  });
  return ibackground;
};

export default GradientRect;
