import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { Animated, StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import ColorNormal from "./data/colorNormal";

interface SynonymWordProps {
  style?: StyleProp<TextStyle>;
  word: string;
  colorNormal: ColorNormal;
}
const SynonymWord: FC<SynonymWordProps> = ({ style, word, colorNormal }) => {
  const [gradient, setGradient] = React.useState(
    colorMapToLinearArray(colorNormal)
  );

  React.useEffect(() => {
    setGradient(colorMapToLinearArray(colorNormal));
  }, [colorNormal]);

  const animFaded = React.useState(new Animated.Value(0))[0];
  React.useEffect(() => {
    Animated.timing(animFaded, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(animFaded, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };
  }, []);

  return (
    <Animated.View style={{ opacity: animFaded }}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[style]}
        colors={gradient.colors}
        locations={gradient.locations}
      >
        <Text style={styles.word}>{word}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({ word: { margin: 5 } });

function colorMapToLinearArray(
  colorNormal: { color: string; value: number }[]
) {
  const gradientColors: string[] = [];
  const gradientLocations: number[] = [];
  let i: number = 0;
  colorNormal.forEach((pair) => {
    gradientColors.push(pair.color, pair.color);
    gradientLocations.push(i);
    i += 1 / colorNormal.length;
    gradientLocations.push(i);
  });
  return { colors: gradientColors, locations: gradientLocations };
}

export default SynonymWord;
