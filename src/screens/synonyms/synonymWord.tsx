import React, { FC, memo, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Platform,
  Animated,
} from "react-native";

import ColorNormal from "./colorChart/colorNormal";
import ColorChart from "./colorChart/colorChart";
import * as Colors from "../../colors";

interface SynonymWordProps {
  word: string;
  colorNormal: ColorNormal;
  onPress: (word: string) => void;
  onLongPress: (word: string) => void;
  style?: ViewStyle;
}

//pressable tile with a word and a color gradient of given color normal
const SynonymWord: FC<SynonymWordProps> = memo(
  ({ colorNormal, word, onPress, onLongPress, style: propStyle }) => {
    const [layoutSize, setLayoutSize] = useState<{
      height: number;
      width: number;
    }>({
      height: 0,
      width: 0,
    });

    const styles = useMemo(() => {
      const { zIndex = 0 } = propStyle ?? {};
      return StyleSheet.create<SynonymWordStyles>({
        chart: { zIndex: zIndex + 1 },
        container: {
          ...propStyle,
          backgroundColor: colorNormal?.getDominantColor() ?? "white",
        },
        word: {
          margin: 5,
          marginHorizontal: 10,
          fontSize: 20,
          zIndex: zIndex + 2,
        },
      });
    }, [propStyle]);

    const onLayout = ({ nativeEvent }) => {
      setLayoutSize({
        height: nativeEvent.layout.height,
        width: nativeEvent.layout.width,
      });
    };

    // use effect hook to run the animation when the component mounts and unmounts
    const viewOpacity = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
      // fade in the component when it mounts
      Animated.timing(viewOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={{ opacity: viewOpacity }}>
        <Pressable
          android_ripple={{
            color: Colors.BGWhite,
            foreground: true,
          }}
          onPress={() => onPress(word)}
          onLongPress={() => {
            onLongPress(word);
          }}
          style={({ pressed }) => ({
            opacity: Platform.OS != "android" && pressed ? 0.6 : 1,
          })}
        >
          <View
            style={styles.container}
            onLayout={layoutSize.width == 0 ? onLayout : undefined}
          >
            {layoutSize.width != 0 && (
              <ColorChart
                colorNormal={colorNormal}
                style={styles.chart}
                size={layoutSize}
              />
            )}
            <Text style={styles.word}>{word}</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

interface SynonymWordStyles {
  chart: ViewStyle;
  container: ViewStyle;
  word: TextStyle;
}

export default SynonymWord;
