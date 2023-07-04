import React from "react";

//maintains an array of variables and accompanying callbacks that are called syncronously when the value is changed

//Key extractor must produce a unique key for each of the variable
//setters are paired to a variable through a key
//when the variables are updated, accompanying setters are called with an updated variable
export function useValueSynchronizer<T>(
  keyProducer: (array: T[]) => Map<string, T>
) {
  const [array, setArray] = React.useState<T[]>([]);

  //used to identify callbacks in an array
  const [keys, setKeys] = React.useState(keyProducer(array));

  //callbacks are stored along their keys and called when the value is updated
  type Callback = (val: T) => void;

  const callbacks = React.useRef(new Map<string, Callback>());
  const registerCallback = React.useCallback(
    (key: string, callback: Callback) => {
      callbacks.current.set(key, callback);
    },
    []
  );

  //if callbacks keys are not in the key array, delete them
  removeMissingMapEntries(callbacks.current, keys);

  //sets the value to state, calls all callbacks with the new value
  const setArrayAndUpdate = React.useCallback(
    (arrayOrCallback: T[] | ((previous) => T[])) => {
      setArray((previous: T[]) => {
        const newArray =
          typeof arrayOrCallback == "function"
            ? arrayOrCallback(previous)
            : arrayOrCallback;
        const newKeys = keyProducer(newArray);
        newKeys.forEach((value, key) => callbacks.current.get(key)?.(value));
        setKeys(newKeys);
        return newArray;
      });
    },
    [setArray, setKeys, keyProducer]
  );

  return { array: array, setArray: setArrayAndUpdate, registerCallback, keys };
}

function removeMissingMapEntries<TKey>(
  removeFrom: Map<TKey, any>,
  missingFrom: Map<TKey, any>
) {
  removeFrom.forEach((_, key) => {
    if (!missingFrom.has(key)) removeFrom.delete(key);
  });
}
