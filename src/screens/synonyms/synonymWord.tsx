import { LinearGradient } from "expo-linear-gradient";
import React, { FC, memo } from "react";
import { Animated, StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import ColorNormal from "./data/colorNormal";
import ColorGradient from "./data/colorGradient";
import * as Animatable from "react-native-animatable";

interface SynonymWordProps {
  style?: StyleProp<TextStyle>;
  word: string;
  colorNormal: ColorNormal;
}
const SynonymWord: FC<SynonymWordProps> = memo(
  ({ style, word, colorNormal }) => {
    //console.log(`${word}-word render`);
    const [gradient, setGradient] = React.useState(
      new ColorGradient(colorNormal)
    );

    React.useEffect(() => {
      setGradient(new ColorGradient(colorNormal));
    }, [colorNormal]);

    React.useEffect(() => {
      animRef.current.fadeIn(1000);
    }, []);

    const animRef = React.useRef(null);
    return (
      <Animatable.View ref={animRef}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[style]}
          colors={gradient.colors}
          locations={gradient.locations}
        >
          <Text style={styles.word}>{word}</Text>
        </LinearGradient>
      </Animatable.View>
    );
  }
);
//<Animated.View style={{ opacity: animFaded }}>
//</Animated.View>
const styles = StyleSheet.create({ word: { margin: 5 } });

export default SynonymWord;
