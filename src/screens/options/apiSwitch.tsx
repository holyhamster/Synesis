import { DeviceEventEmitter, View } from "react-native";
import {
  DictionaryKeyRequirement,
  DictionaryName,
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

  //create data for each API in the dictionary
  const apiTogglesData = Object.values(DictionaryType).map((dictionaryType) => {
    return {
      name: dictionaryType,
      state: currentDictionaryType == dictionaryType,
      text: DictionaryName[dictionaryType],
    };
  });

  //popup modal when a toggle is pressed
  const onTogglePress = (dictionaryType: DictionaryType) => {
    const { state: enabled } = apiTogglesData.find(
      ({ name }) => name == dictionaryType
    );

    if (DictionaryKeyRequirement[dictionaryType]) {
      navigation.navigate("InputModal", {
        varName: dictionaryType,
        varHint: `Enter a key for ${DictionaryName[dictionaryType]} API`,
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

  //listen to the event of modal resolution
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
          `Please provide a key to use ${DictionaryName[dictionaryType]} API`
        );
      }
    };

    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.ApiKeyEntered,
      callback
    );
    return () => subscription.remove();
  }, []);

  return (
    <View>
      {apiTogglesData.map(({ name, state, text }) => (
        <TitledToggle
          key={name}
          onValueChange={() => {
            onTogglePress(name);
          }}
          state={state}
          title={text}
        />
      ))}
    </View>
  );
};

export default ApiSwitch;
