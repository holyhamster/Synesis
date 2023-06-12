import React, { FC } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import * as Colors from "../../colors";

interface HintViewProps {
  style?: StyleProp<ViewStyle>;
  hintText: string;
  onPress: () => void;
}

const HintView: FC<HintViewProps> = ({ style, hintText, onPress }) => {
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
    <Animated.View style={[{ opacity: animFaded }, styles.view, style]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={{ fontSize: 20 }}>{hintText}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: Colors.BGWhite,
    borderColor: Colors.CountourColor,
    borderRadius: 5,
    borderWidth: 1,
    padding: 6,
  },
});

export default HintView;
