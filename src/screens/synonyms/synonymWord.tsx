import React, { FC, memo, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ViewStyle,
  TextStyle,
} from "react-native";

import ColorNormal from "./colorChart/colorNormal";
import ColorChart from "./colorChart/colorChart";

interface SynonymWordProps {
  word: string;
  colorNormal: ColorNormal;
  onPress: (word: string) => void;
  style?: ViewStyle;
}

//pressable tile with a word and a sharp color gradient of given color normal
const SynonymWord: FC<SynonymWordProps> = memo(
  ({ colorNormal, word, onPress, style: propStyle }) => {
    const [layoutSize, setLayoutSize] = useState<{
      height: number;
      width: number;
    }>({
      height: 0,
      width: 0,
    });

    //tracks when touch started and ended to display a view with opacity on top
    const [highlighted, setHighlighted] = useState(false);

    const styles = useMemo(() => {
      const { zIndex = 0 } = propStyle ?? {};

      return StyleSheet.create<SynonymWordStyles>({
        chart: { zIndex: zIndex + 1 },
        container: {
          ...propStyle,
          backgroundColor: colorNormal?.getDominantColor() ?? "white",
        },
        touchOverlay: {
          flex: 1,
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          right: 0,
          backgroundColor: "white",
          opacity: highlighted ? 0.5 : 0,
          zIndex: zIndex + 3,
        },
        word: {
          flex: 1,
          margin: 5,
          marginHorizontal: 10,
          fontSize: 20,
          zIndex: zIndex + 2,
        },
      });
    }, [propStyle, highlighted]);

    const onLayout = ({ nativeEvent }) => {
      setLayoutSize({
        height: nativeEvent.layout.height,
        width: nativeEvent.layout.width,
      });
    };

    return (
      <TouchableHighlight
        onPress={() => onPress(word)}
        onHideUnderlay={() => setHighlighted(false)}
        onShowUnderlay={() => setHighlighted(true)}
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

          <View style={styles.touchOverlay} />
          <Text style={styles.word}>{word}</Text>
        </View>
      </TouchableHighlight>
    );
  }
);

interface SynonymWordStyles {
  chart: ViewStyle;
  container: ViewStyle;
  touchOverlay: ViewStyle;
  word: TextStyle;
}

export default SynonymWord;
