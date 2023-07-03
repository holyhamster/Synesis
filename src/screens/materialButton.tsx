import React, { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export interface MaterialButtonStyle {
  backgroundColor?: string;
  countourColor?: string;
  disabledCountourColor?: string;
  size?: number;
  opacity?: number;
}

interface MaterialButtonProps {
  style?: MaterialButtonStyle;
  disabled?: boolean;
  name: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
}

//a button with a material icon
const MaterialButton: FC<MaterialButtonProps> = ({
  disabled,
  style,
  name,
  onPress,
}) => {
  const bgColor = style?.backgroundColor || defaultBackground;
  const counterColor = disabled
    ? style?.disabledCountourColor || defaultDisabled
    : style?.countourColor || defaultCountour;
  return (
    <TouchableOpacity
      style={{
        ...styles.inputButton,
        backgroundColor: bgColor,
        borderColor: counterColor,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <MaterialIcons
        name={name}
        size={style?.size || defaultSize}
        color={counterColor}
      />
    </TouchableOpacity>
  );
};

const defaultCountour = "black";
const defaultBackground = "white";
const defaultDisabled = "darkgrey";
const defaultSize = 40;

const styles = StyleSheet.create({
  inputButton: {
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 5,
  },
});

export default MaterialButton;
