import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import HintView from "./hintsView";

interface HintOverlayProps {
  currentHintID: number;
  synonymsExist: boolean;
  onHintPress: () => void;
}

const HintOverlay: FC<HintOverlayProps> = ({
  currentHintID,
  synonymsExist,
  onHintPress,
}) => {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {currentHintID == 0 && (
        <HintView
          style={{ ...styles.hint, bottom: 130 }}
          hintText="Enter a word"
          onPress={onHintPress}
        />
      )}

      {currentHintID == 1 && synonymsExist && (
        <HintView
          style={{
            ...styles.hint,
            bottom: "50%",
          }}
          hintText="Add more related words"
          onPress={onHintPress}
        />
      )}

      {currentHintID == 2 && (
        <HintView
          style={{ ...styles.hint, bottom: 120 }}
          hintText="Hold selected word to sort the results"
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
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    zIndex: 3,
  },
  hint: {
    zIndex: 4,
    position: "absolute",
  },
});

export default HintOverlay;
