import React, { FC } from "react";
import {
  ButtonProps,
  DeviceEventEmitter,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { InputModalProps } from "../navigation";
import MaterialButton from "./materialButton";
import * as Colors from "../colors";

export interface InputModalEventParams {
  varName: string;
  varValue: string;
}

//Modal that asks for a string and launches an event after it has been submitted
const InputModal: FC<InputModalProps> = ({ navigation, route }) => {
  const { eventName, varName, varHint, varLink } = route.params;

  const submitValue = (value: string) => {
    const params: InputModalEventParams = { varName: varName, varValue: value };
    DeviceEventEmitter.emit(eventName, params);
  };

  const [inputText, setInputText] = React.useState("");
  return (
    <View style={styles.parentView}>
      <Text style={styles.hintText}>Enter {varHint ?? "variable"}</Text>
      <Text style={styles.linkText} onPress={() => Linking.openURL(varLink)}>
        {varLink}
      </Text>
      <TextInput
        autoFocus={true}
        blurOnSubmit={true}
        value={inputText}
        onChangeText={(text) => {
          setInputText(text);
        }}
        style={styles.input}
        onSubmitEditing={({ nativeEvent }) => {
          const { text } = nativeEvent;
          if (text) {
            submitValue(text);
            navigation.goBack();
          }
        }}
      />
      <View style={styles.buttonView}>
        <MaterialButton
          name="clear"
          onPress={() => navigation.goBack()}
          style={{ size: 50 }}
        />
        <MaterialButton
          name="check"
          onPress={() => submitValue(inputText)}
          style={{ size: 50 }}
        />
      </View>
    </View>
  );
};

interface InputModalStyleProps {
  buttonView: ViewStyle;
  buttons: ButtonProps;
  input: TextStyle;
  linkText: TextStyle;
  parentView: ViewStyle;
  hintText: TextStyle;
}

const styles = StyleSheet.create<InputModalStyleProps>({
  buttonView: { flexDirection: "row", gap: 10 },
  buttons: {},
  input: {
    backgroundColor: Colors.BGWhite,
    fontSize: 20,
    width: "80%",
    justifyContent: "center",
    textAlign: "center",
  },
  linkText: { fontSize: 20, color: "blue" },
  parentView: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  hintText: { fontSize: 25 },
});
export default InputModal;
