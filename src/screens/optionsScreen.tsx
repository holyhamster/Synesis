import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Accordion from "react-native-collapsible/Accordion";
import React, { FC } from "react";
import OptionsApiSwitch from "../optionsApiSwitch";
import { OptionsProps } from "../../App";

const OptionsScreen: FC<OptionsProps> = ({ navigation }) => {
  enum AccordionEnum {
    Display = "Display",
    API = "API",
    About = "About",
  }

  const renderAccordionHeader = (title, index, isActive) => {
    return (
      <View key={index} style={styles.header}>
        {isActive ? (
          <MaterialIcons name="expand-less" size={24} color="black" />
        ) : (
          <MaterialIcons name="expand-more" size={24} color="black" />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  const accordionContents = {
    [AccordionEnum.Display]: (
      <View>
        <Text>Here be display options</Text>
      </View>
    ),
    [AccordionEnum.API]: (
      <View>
        <OptionsApiSwitch navigation={navigation} />
      </View>
    ),
    [AccordionEnum.About]: (
      <View>
        <Text>Some info about the app</Text>
      </View>
    ),
  };

  const renderAccordionTitle = (title) => {
    return accordionContents[title] || null;
  };

  const [activeSessions, setActiveSessions] = React.useState<number[]>([]);
  const updateSections = (activeSections: number[]) => {
    setActiveSessions([...activeSections]);
  };

  return (
    <View>
      <Accordion
        underlayColor={"white"}
        sections={Object.values(AccordionEnum)}
        activeSections={activeSessions}
        renderHeader={renderAccordionHeader}
        renderContent={renderAccordionTitle}
        onChange={updateSections}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OptionsScreen;
