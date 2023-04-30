import React, { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SynDefinition from "./synDefinition";
import { TagCloud } from "react-tagcloud/rn";

interface SynonymListProps {
  synArray: SynDefinition[];
  addWord: (newWord: string) => void;
}

const SynonymListView: FC<SynonymListProps> = ({
  synArray: synArray,
  addWord,
}) => {
  const [extended, setExtended] = React.useState<Boolean>(false);

  const data = buildCloudData(synArray);

  return (
    <TagCloud
      minSize={20}
      maxSize={35}
      tags={data}
      shuffle={false}
      onPress={(tag) => addWord(tag.value)}
    />
  );
};

function buildCloudData(syns: SynDefinition[]): any {
  const occurances: Map<string, any> = new Map();
  syns.forEach((synDef) => {
    synDef.Sets.forEach((synArray) => {
      synArray.forEach((synonym) => {
        let data = occurances.get(synonym);
        if (!data) {
          data = { value: synonym, color: synDef.Color, count: 30 };
          occurances.set(synonym, data);
        } else data.count += 1;
      });
    });
  });
  return Array.from(occurances.values());
}
export default SynonymListView;
