import React, { useEffect, useCallback, useState } from "react";
import SynonymCollection from "./synonymCollection";
import Dictionary from "../dictionary";
import { ToastAndroid } from "react-native";

//react hook that provides tools for interracting with synonym collections
export function useSynonyms(
  dictionary: Dictionary,
  onRemove?: (word: string) => void
) {
  const [synonyms, setSynonyms] = React.useState<SynonymCollection[]>([]);

  const forceUpdate = useCallback(
    () => setSynonyms((previous) => Array.from(previous)),
    [setSynonyms]
  );

  useEffect(() => {
    setSynonyms([]);
  }, [dictionary]);

  const addWord = useCallback(
    (word: string) => {
      setSynonyms((previousSynonym) => {
        const newSynonym = new SynonymCollection(word);
        const EMPTY = !newSynonym || newSynonym.Word == "";
        const ARRAY_HAS_WORD =
          previousSynonym.findIndex(
            (definiton) => definiton.Word == newSynonym.Word
          ) != -1;
        if (!EMPTY && !ARRAY_HAS_WORD) {
          fetchSynonym(newSynonym, dictionary, forceUpdate);
          return [...previousSynonym, newSynonym];
        }
        return previousSynonym;
      });
    },
    [setSynonyms, dictionary, forceUpdate]
  );

  const removeWord = useCallback(
    (removedWord: string) => {
      setSynonyms((previousSynonyms) => {
        const index = previousSynonyms.findIndex(
          ({ Word }) => Word == removedWord
        );
        if (index < 0) return previousSynonyms;
        onRemove?.(removedWord);
        return [
          ...previousSynonyms.slice(0, index),
          ...previousSynonyms.slice(index + 1),
        ];
      });
    },
    [setSynonyms, onRemove]
  );

  const clearWords = useCallback(() => setSynonyms([]), [setSynonyms]);
  return { synonyms, addWord, removeWord, clearWords };
}

async function fetchSynonym(
  syn: SynonymCollection,
  currentDict: Dictionary,
  updateCallback: () => void
) {
  const onFail = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
    updateCallback();
  };

  return syn.Load(currentDict, updateCallback, onFail);
}
