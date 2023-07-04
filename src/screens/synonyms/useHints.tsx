import React from "react";
import { DeviceEventEmitter } from "react-native";
import Storage, { StringTypesEnum } from "../../dictionaries/storageHandling";
import { EventsEnum } from "../../events";
import { useToast } from "react-native-toast-notifications";

export function useHints(screenFocused: boolean, synnonymCount: number) {
  const [shownHintID, setShownHintID] = React.useState(-1);

  //detect if app was launched before and set showingHint to 0 if it wasn't
  React.useEffect(() => {
    const loadHints = () =>
      Storage.GetString(StringTypesEnum.WasLaunched).then((value) => {
        if (!value) {
          Storage.SetString(StringTypesEnum.WasLaunched, "yes");
          setShownHintID(0);
        }
      });
    loadHints();
    const subscription = DeviceEventEmitter.addListener(
      EventsEnum.HintsReset,
      loadHints
    );
    return () => subscription.remove();
  }, []);

  //increment hint ID when conditions are met
  React.useEffect(() => {
    if (shownHintID == 0 && synnonymCount > 0) setShownHintID(1);
    if (shownHintID == 1 && synnonymCount > 1) setShownHintID(2);
  }, [synnonymCount]);

  //show hint toast when the main screen is focused
  const toast = useToast();
  React.useEffect(() => {
    if (!screenFocused) return;
    if (shownHintID >= 0 && shownHintID <= hintText.length)
      toast.show?.(hintText[shownHintID], {
        onPress: (id) => toast?.hide(id),
      });
  }, [shownHintID, screenFocused]);
}

const hintText = [
  `Enter a word to find its synonyms`,
  `Add more related words`,
  `Press and hold any selected word to prioritize its relation`,
];
