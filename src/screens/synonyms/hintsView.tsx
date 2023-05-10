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

interface HintViewProps {
  style?: StyleProp<ViewStyle>;
  hintText: string;
  onPress: () => void;
}

const HintView: FC<HintViewProps> = ({
  style: styleProp,
  hintText,
  onPress,
}) => {
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

  const styles = StyleSheet.create({
    view: {
      backgroundColor: "lightgrey",
      borderColor: "white",
      borderRadius: 5,
      borderWidth: 1,
      padding: 6,
    },
  });

  return (
    <Animated.View style={[{ opacity: animFaded }, styles.view, styleProp]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={{ fontSize: 20, flexWrap: "wrap" }}>{hintText}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default HintView;
