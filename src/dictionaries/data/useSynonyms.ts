import React, { useEffect, useCallback, useState } from "react";
import SynonymCollection from "./synonymCollection";
import Dictionary from "../dictionary";
import { useToast } from "react-native-toast-notifications";

//react hook that provides tools for interracting with synonym collections
export function useSynonyms(
  dictionary: Dictionary,
  onRemove?: (word: string) => void
) {
  const [synonyms, setSynonyms] = React.useState<SynonymCollection[]>([]);
  const toast = useToast();

  useEffect(() => {
    setSynonyms([]);
  }, [dictionary]);

  const addWord = useCallback(
    (word: string) => {
      setSynonyms((previous) => {
        const newSynonym = new SynonymCollection(word);
        const EMPTY = !newSynonym || newSynonym.Word == "";
        const HAS_WORD_ALREADY =
          previous.findIndex(
            (definiton) => definiton.Word == newSynonym.Word
          ) != -1;

        if (!EMPTY && !HAS_WORD_ALREADY) {
          newSynonym.Load(dictionary).then((result) => {
            if (result.type == "error") toast.show(result.errorMessage);
            setSynonyms((previous) => Array.from(previous));
          });
          return [...previous, newSynonym];
        }
        return previous;
      });
    },
    [setSynonyms, dictionary]
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
