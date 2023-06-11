import { View, Text, StyleSheet, DeviceEventEmitter } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Accordion from "react-native-collapsible/Accordion";
import React, { FC, useState } from "react";
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

const OptionsScreen: FC<OptionsProps> = ({ navigation }) => {
  enum AccordionEnum {
    Display = "Display",
    API = "API",
    About = "About",
  }

  const [tileLayout, setTileLayout] = useState(false);
  GetStringFromStorage(StringTypesEnum.TileLayout).then((val) => {
    setTileLayout(val != undefined && val != "");
  });

  const accordionContents = {
    [AccordionEnum.Display]: (
      <>
        <TileCountSwitch />
        {
          //add option after fixing FlatList animation
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
        </View>*/
        }
      </>
    ),
    [AccordionEnum.API]: <ApiSwitch navigation={navigation} />,
    [AccordionEnum.About]: <Text>Some info about the app</Text>,
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
        sections={Object.values(AccordionEnum)}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  content: { left: 20, paddingVertical: 20 },
  title: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OptionsScreen;
