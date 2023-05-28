import React, { FC } from "react";
import {
  Button,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { InputModalProps } from "../navigation";

export interface InputModalEventParams {
  varName: string;
  varValue: string;
}

//Modal that asks for a string and launches an event after it has been submitted
const InputModal: FC<InputModalProps> = ({ navigation, route }) => {
  const { eventName, varName, varHint } = route.params;

  const submitValue = (value: string) => {
    const params: InputModalEventParams = { varName: varName, varValue: value };
    DeviceEventEmitter.emit(eventName, params);
    navigation.goBack();
  };

  const [inputText, setInputText] = React.useState("");
  return (
    <View style={styles.parentView}>
      <Text style={styles.text}>Enter {varHint ?? "variable"}</Text>
      <TextInput
        autoFocus={true}
        blurOnSubmit={true}
        value={inputText}
        onChangeText={(text) => {
          setInputText(text);
        }}
        onSubmitEditing={({ nativeEvent }) => {
          const { text } = nativeEvent;
          if (text) submitValue(text);
        }}
      />
      <View style={styles.buttonView}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="OK" onPress={() => submitValue(inputText)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentView: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 30 },
  buttonView: { flexDirection: "row" },
});
export default InputModal;
