import React, { FC } from "react";
import { TagCloud } from "react-tagcloud/rn";
import DataEntry from "./dataEntry";

interface SynonymListProps {
  entries: DataEntry[];
  addWord: (newWord: string) => void;
}

const SynonymListView: FC<SynonymListProps> = ({ entries, addWord }) => {
  const [extended, setExtended] = React.useState<Boolean>(false);
  return (
    <TagCloud
      minSize={20}
      maxSize={50}
      tags={entries}
      shuffle={false}
      onPress={(tag) => addWord(tag.value)}
    />
  );
};

export default SynonymListView;
