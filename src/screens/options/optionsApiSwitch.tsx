import {
  DeviceEventEmitter,
  Switch,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";
import {
  DictionaryKeyRequirement,
  DictionaryType,
} from "../../dictionaries/dictionary";
import React, { FC } from "react";
import { InputModalEventParams } from "../inputModal";
import { OptionsProps } from "../../navigation";
import { EventsEnum } from "../../events";
import {
  LoadCurrentDictionaryType,
  SaveCurrentDictionaryType,
} from "../../dictionaries/dictionaryOptions";

interface OptionsApiSwitchProps {
  navigation: OptionsProps["navigation"];
}

//List of toggles to switch API, pops up InputModal for API key
export const OptionsApiSwitch: FC<OptionsApiSwitchProps> = ({ navigation }) => {
  const [currentDictionaryType, setCurrentDictionaryType] =
    React.useState<DictionaryType>();

  React.useEffect(() => {
    LoadCurrentDictionaryType().then((result) =>
      setCurrentDictionaryType(result)
    );

    //listen to an event from InputModal, change Dictionary and API key on recieve
    const callback = (params: InputModalEventParams) => {
      const { varName, varValue: apiKey } = params;
      const dictionaryType = varName as DictionaryType;
      if (currentDictionaryType != dictionaryType || apiKey) {
        setCurrentDictionaryType(dictionaryType as DictionaryType);
        SaveCurrentDictionaryType(
          dictionaryType as DictionaryType,
          apiKey
        ).then(() => DeviceEventEmitter.emit(EventsEnum.ApiChanged));
      } else {
        ToastAndroid.show(
          `Please provide an API key to use ${dictionaryType} dictionary`,
          ToastAndroid.LONG
        );
      }
    };

    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.ApiKeyEntered,
      callback
    );
    return () => subscription.remove();
  }, []);

  const apiTogglesData = Object.values(DictionaryType).map((dictionaryType) => {
    return {
      name: dictionaryType,
      state: currentDictionaryType == dictionaryType,
    };
  });

  const onPressAPIToggle = (dictionaryType: DictionaryType) => {
    const { state: enabled } = apiTogglesData.find(
      (apiToggle) => apiToggle.name == dictionaryType
    );

    if (DictionaryKeyRequirement[dictionaryType]) {
      navigation.navigate("InputModal", {
        varName: dictionaryType,
        varHint: dictionaryType,
        eventName: EventsEnum.ApiKeyEntered,
      });
      return;
    }

    if (!enabled) {
      setCurrentDictionaryType(dictionaryType);
      SaveCurrentDictionaryType(dictionaryType).then(() =>
        DeviceEventEmitter.emit(EventsEnum.ApiChanged)
      );
    }
  };

  return (
    <View>
      {apiTogglesData.map(({ name, state }) => (
        <TouchableHighlight
          key={name}
          onPress={() => onPressAPIToggle(name)}
          style={{ padding: 10 }}
          underlayColor={"white"}
        >
          <View style={{ flexDirection: "row", left: 20 }}>
            <Switch
              key={name}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => onPressAPIToggle(name)}
              value={state}
            />
            <Text>{name}</Text>
          </View>
        </TouchableHighlight>
      ))}
    </View>
  );
};

export default OptionsApiSwitch;
