import React, { FC } from "react";
import {
  Animated,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface BackgroundImageProps {
  style?: ViewStyle;
  faded: boolean;
  source: ImageSourcePropType;
  fadeCeiling?: number;
  fadeFloor?: number;
  duration?: number;
}

//background image with animated opacity
const BackgroundImage: FC<BackgroundImageProps> = ({
  style,
  faded,
  source,
  fadeFloor,
  fadeCeiling,
  duration,
}) => {
  fadeFloor = isNaN(fadeFloor) ? defaultFadeFloor : fadeFloor;
  fadeCeiling = isNaN(fadeCeiling) ? defaultFadeCeiling : fadeCeiling;
  duration = isNaN(duration) ? defaultDuration : duration;

  const animatiedOpacity = React.useState(new Animated.Value(fadeCeiling))[0];
  React.useEffect(() => {
    Animated.timing(animatiedOpacity, {
      toValue: faded ? fadeFloor : fadeCeiling,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [faded]);

  return (
    <Animated.View
      style={{ ...style, ...styles.view, opacity: animatiedOpacity }}
    >
      <ImageBackground
        source={source}
        resizeMode="center"
        style={styles.imageBackground}
      ></ImageBackground>
    </Animated.View>
  );
};

const defaultFadeCeiling = 0.85;
const defaultFadeFloor = 0.4;
const defaultDuration = 1000;

const styles = StyleSheet.create({
  view: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  imageBackground: { width: "100%", height: "100%" },
});

export default BackgroundImage;
