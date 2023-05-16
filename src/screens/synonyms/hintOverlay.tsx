import React, { FC } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import HintView from "./hintsView";

interface HintOverlayProps {
  style?: StyleProp<ViewStyle>;
  currentHintID: number;
  synonymsExist: boolean;
  onHintPress: () => void;
}

const HintOverlay: FC<HintOverlayProps> = ({
  style,
  currentHintID,
  synonymsExist,
  onHintPress,
}) => {
  return (
    <View style={[style, styles.overlay]} pointerEvents="box-none">
      {currentHintID == 0 && (
        <HintView
          style={{ ...styles.hint, bottom: 120, left: "5%", maxWidth: "90%" }}
          hintText="Enter a word you're looking into"
          onPress={onHintPress}
        />
      )}

      {currentHintID == 1 && synonymsExist && (
        <HintView
          style={{
            ...styles.hint,
            bottom: 120,
            right: "5%",
            maxWidth: "70%",
          }}
          hintText="Add/remove words to widen/remove the search!"
          onPress={onHintPress}
        />
      )}

      {currentHintID == 2 && (
        <HintView
          style={{ ...styles.hint, top: 80, left: "5%", maxWidth: "90%" }}
          hintText="Select different API if you're not happy with the results"
          onPress={onHintPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    zIndex: 2,
  },
  hint: {
    zIndex: 3,
    position: "absolute",
  },
});

export default HintOverlay;
