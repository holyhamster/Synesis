import React, { FC, useMemo, useCallback, useRef } from "react";
import DataEntryClass from "./data/dataEntry";
import { StyleSheet } from "react-native";
import ColorNormal from "./data/colorNormal";
import SynonymWord from "./synonymWord";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";

interface SynonymListProps {
  entries: Map<string, DataEntryClass>;
  colorMap: Map<string, string>;
  addWord: (newWord: string) => void;
}

const SynonymListView: FC<SynonymListProps> = ({
  entries,
  colorMap,
  addWord,
}) => {
  //console.log("list render");
  const colorNormals = useRef(new Map<string, ColorNormal>());

  useMemo(() => {
    //colorNormals.current.clear();
    entries.forEach((entry, name) => {
      const normal = new ColorNormal(entry.GetWordNormal(), colorMap);
      const oldNormal = colorNormals.current.get(name);
      if (!oldNormal || !oldNormal.isEqual(normal))
        colorNormals.current.set(name, normal);
    });
  }, [colorMap, entries]);

  const onWordPress = useCallback(
    (name) => () => {
      //LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      addWord(name);
    },
    [addWord]
  );

  const ref = useRef<TransitioningView>();
  ref.current?.animateNextTransition();
  return (
    <Transitioning.View
      ref={ref}
      style={{ ...styles.list }}
      transition={transition}
    >
      {Array.from(entries.values()).map((entry) => {
        const colorNormal = colorNormals.current.get(entry.name);
        const onPress = onWordPress(entry.name);
        //console.log(colorNormal);
        if (!colorNormal?.isValid) return <></>;
        //return <></>;
        return (
          <SynonymWord
            key={entry.name}
            word={entry.name}
            colorNormal={colorNormal}
            onPress={() => {
              onPress();
              if (ref.current) ref.current.animateNextTransition();
            }}
          />
        );
      })}
    </Transitioning.View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
  },
  word: {
    fontSize: 20,
  },
});

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={500} />
    <Transition.Out type="fade" durationMs={500} />
  </Transition.Together>
);

export default SynonymListView;
