import React, { FC } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

// Toggle with a title
interface TitledToggleProps {
  title: string;
  state: boolean;
  onValueChange: (state: boolean) => void;
}
const TitledToggle: FC<TitledToggleProps> = ({
  title,
  state,
  onValueChange,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!state)}
      style={styles.touchable}
    >
      <View style={styles.view}>
        <Switch value={state} onValueChange={() => onValueChange(!state)} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: { left: 20, fontSize: 16 },
  touchable: { padding: 10 },
  view: { flexDirection: "row", left: 20, alignItems: "center" },
});

export default TitledToggle;
