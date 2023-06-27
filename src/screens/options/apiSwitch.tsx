import { DeviceEventEmitter, View } from "react-native";
import {
  DictionaryKeyRequirement,
  DictionaryRegistrationLinks,
  DictionaryType,
} from "../../dictionaries/dictionary";
import React, { FC } from "react";
import { useToast } from "react-native-toast-notifications";

import { InputModalEventParams } from "../inputModal";
import { OptionsProps } from "../../navigation";
import { EventsEnum } from "../../events";
import {
  LoadCurrentDictionaryType,
  SaveCurrentDictionaryType,
} from "../../dictionaries/dictionaryLoading";
import TitledToggle from "../titledToggle";

interface ApiSwitchProps {
  navigation: OptionsProps["navigation"];
}

//List of toggles to switch API, pops up InputModal for API key when required
export const ApiSwitch: FC<ApiSwitchProps> = ({ navigation }) => {
  const toast = useToast();
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
        toast.show(
          `Please provide an API key to use ${dictionaryType} dictionary`
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

  const onTogglePress = (dictionaryType: DictionaryType) => {
    const { state: enabled } = apiTogglesData.find(
      ({ name }) => name == dictionaryType
    );

    if (DictionaryKeyRequirement[dictionaryType]) {
      navigation.navigate("InputModal", {
        varName: dictionaryType,
        varHint: `Enter API key for ${dictionaryType}`,
        varLink: DictionaryRegistrationLinks[dictionaryType], //todo move into personalized api section
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
        <TitledToggle
          key={name}
          onValueChange={() => {
            onTogglePress(name);
          }}
          state={state}
          title={name}
        />
      ))}
    </View>
  );
};

export default ApiSwitch;
