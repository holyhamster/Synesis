import React, { useEffect, useCallback, useState } from "react";
import SynonymCollection from "./synonymCollection";
import Dictionary from "../dictionary";
import { ToastAndroid } from "react-native";

//react hook that provides tools for interracting with synonym collections
export function useSynonyms(
  currentDict: Dictionary,
  onRemove?: (word: string) => void
) {
  const [synonymArray, setSynonymArray] = React.useState<SynonymCollection[]>(
    []
  );

  useEffect(() => {
    synonymArray.forEach((syn) =>
      fetchSynonym(syn, currentDict, () =>
        setSynonymArray((previous) => Array.from(previous))
      )
    );
  }, [currentDict]);

  const forceSynArrayUpdate = useCallback(
    () => setSynonymArray((previous) => Array.from(previous)),
    [setSynonymArray]
  );

  const addWord = useCallback(
    (word: string) => {
      setSynonymArray((previous) => {
        const newSynonym = new SynonymCollection(word);
        const EMPTY = !newSynonym || newSynonym.Word == "";
        const ARRAY_HAS_WORD =
          synonymArray.findIndex(
            (definiton) => definiton.Word == newSynonym.Word
          ) != -1;
        if (!EMPTY && !ARRAY_HAS_WORD) {
          fetchSynonym(newSynonym, currentDict, forceSynArrayUpdate);
          return [...previous, newSynonym];
        }
        return previous;
      });
    },
    [setSynonymArray, currentDict, forceSynArrayUpdate]
  );

  const removeWord = useCallback(
    (removedWord: string) => {
      setSynonymArray((previous) => {
        const index = previous.findIndex(({ Word }) => Word == removedWord);
        if (index < 0) return previous;
        onRemove?.(removedWord);
        return [...previous.slice(0, index), ...previous.slice(index + 1)];
      });
    },
    [setSynonymArray, onRemove]
  );

  const clearWords = useCallback(() => setSynonymArray([]), [setSynonymArray]);
  return { synArray: synonymArray, addWord, removeWord, clearWords };
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
