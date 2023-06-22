import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Accordion from "react-native-collapsible/Accordion";
import React, { FC, useEffect, useState } from "react";
import ApiSwitch from "./apiSwitch";
import { OptionsProps } from "../../navigation";
import {
  GetStringFromStorage,
  SetStringInStorage,
  StringTypesEnum,
} from "../../dictionaries/storageHandling";
import { EventsEnum } from "../../events";
import TitledToggle from "../titledToggle";
import * as Colors from "../../colors";
import TileCountSwitch from "./tileCountSwitch";
import * as Haptics from "expo-haptics";

const OptionsScreen: FC<OptionsProps> = ({ navigation, route }) => {
  const { unravel } = route.params ?? { unravel: undefined };

  useEffect(() => {
    const propIndex = Object.keys(OptionSectionsEnum).indexOf(unravel);
    if (propIndex >= 0) setActiveSessions([propIndex]);
  }, []);

  const [tileLayout, setTileLayout] = useState(false);
  GetStringFromStorage(StringTypesEnum.TileLayout).then((val) => {
    setTileLayout(val != undefined && val != "");
  });

  const accordionContents = {
    [OptionSectionsEnum.Display]: (
      <>
        <TileCountSwitch />
        {/*add option after fixing FlatList animation*/
        /*<View>
          <TitledToggle
            title="Tile layout"
            onValueChange={(state) => {
              setTileLayout(state);
              SetStringInStorage(
                StringTypesEnum.TileLayout,
                state ? "yes" : ""
              );
              DeviceEventEmitter.emit(EventsEnum.LayoutChanged);
            }}
            state={tileLayout}
          />
        </View>*/}
      </>
    ),
    [OptionSectionsEnum.API]: <ApiSwitch navigation={navigation} />,
    [OptionSectionsEnum.About]: <Text>Some info about the app</Text>,
    [OptionSectionsEnum.Hints]: (
      <TouchableOpacity
        style={styles.resetHints}
        onPress={() => {
          Haptics.selectionAsync();
          SetStringInStorage(StringTypesEnum.WasLaunched, "").then(() =>
            DeviceEventEmitter.emit(EventsEnum.HintsReset)
          );
        }}
      >
        <MaterialIcons name="replay-circle-filled" size={40} />
        <Text style={{ fontSize: 15 }}>Reset Hints</Text>
      </TouchableOpacity>
    ),
  };

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

  const renderAccordingContent = (title) => {
    return (
      <View style={styles.content}>{accordionContents[title]}</View> || null
    );
  };

  const [activeSessions, setActiveSessions] = React.useState<number[]>([]);
  const updateSections = (activeSections: number[]) => {
    setActiveSessions([...activeSections]);
  };

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

export enum OptionSectionsEnum {
  Display = "Display",
  API = "API",
  Hints = "Hints",
  About = "About",
}

export default OptionsScreen;
