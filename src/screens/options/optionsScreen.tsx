import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Accordion from "react-native-collapsible/Accordion";
import * as Haptics from "expo-haptics";

import ApiSwitch from "./apiSwitch";
import { OptionsProps } from "../../navigation";
import Storage, { StringTypesEnum } from "../../dictionaries/storageHandling";
import { EventsEnum } from "../../events";
import * as Colors from "../../colors";
import CloudCountSwitch from "./cloudCountSwitch";

const OptionsScreen: FC<OptionsProps> = ({ navigation, route }) => {
  const renderAccordionHeader = (title, index, isActive) => {
    return (
      <View key={index} style={{ ...styles.header }}>
        {isActive ? (
          <MaterialIcons
            name="expand-less"
            size={24}
            color={Colors.CountourColor}
          />
        ) : (
          <MaterialIcons
            name="expand-more"
            size={24}
            color={Colors.CountourColor}
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  const accordionContents = {
    [OptionSectionsEnum.Display]: <CloudCountSwitch />,
    [OptionSectionsEnum.API]: <ApiSwitch navigation={navigation} />,
    [OptionSectionsEnum.About]: (
      <Text style={styles.linkText} onPress={() => Linking.openURL(ABOUT_LINK)}>
        {ABOUT_LINK}
      </Text>
    ),
    [OptionSectionsEnum.Hints]: (
      <TouchableOpacity
        style={styles.resetHints}
        onPress={() => {
          if (Platform.OS == "android") Haptics.selectionAsync();
          Storage.SetString(StringTypesEnum.WasLaunched, "").then(() =>
            DeviceEventEmitter.emit(EventsEnum.HintsReset)
          );
        }}
      >
        <MaterialIcons name="replay-circle-filled" size={30} />
        <Text style={{ fontSize: 15 }}>Reset Hints</Text>
      </TouchableOpacity>
    ),
  };

  const renderAccordingContent = (title) => {
    return (
      <View style={styles.content}>{accordionContents[title]}</View> || null
    );
  };

  const [activeSessions, setActiveSessions] = React.useState<number[]>([]);
  const updateSections = (activeSections: number[]) => {
    setActiveSessions([...activeSections]);
  };

  //unravel certain section if parameter is present
  const { unravel } = route.params ?? { unravel: undefined };
  useEffect(() => {
    const propIndex = Object.keys(OptionSectionsEnum).indexOf(unravel);
    if (propIndex >= 0) setActiveSessions([propIndex]);
  }, []);

  return (
    <View>
      <Accordion
        underlayColor={Colors.BGWhite}
        sections={Object.values(OptionSectionsEnum)}
        activeSections={activeSessions}
        renderHeader={renderAccordionHeader}
        renderContent={renderAccordingContent}
        onChange={updateSections}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { left: 20, paddingVertical: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  linkText: { fontSize: 15, color: "blue" },
  resetHints: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});

const ABOUT_LINK = "https://github.com/holyhamster/Synesis/";
export enum OptionSectionsEnum {
  Display = "Display",
  API = "API",
  Hints = "Hints",
  About = "About",
}

export default OptionsScreen;
