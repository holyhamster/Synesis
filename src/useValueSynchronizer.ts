import React from "react";

//maintains an array of values
//if child components register for live updates, they will recieve them live whenever setter is used
export function useValueSynchronizer<T>(
  keyExtractor: (array: T[]) => Map<string, T>
) {
  const [values, setValues] = React.useState<T[]>([]);

  //used to identify setters in an array
  const [keys, setKeys] = React.useState(keyExtractor(values));

  //setters are stored and called when the value is changed
  type Setter = (val: T) => void;

  const setters = React.useRef(new Map<string, Setter>());

  removeUnusedSetters(setters, keys);

  const registerSetter = React.useCallback((key: string, setter: Setter) => {
    setters.current.set(key, setter);
  }, []);

  //sets the value state and calls all setters
  const setArray = React.useCallback(
    (newArray: T[], callback?: (previous) => void) => {
      const newKeys = keyExtractor(newArray);
      setValues((previous) => {
        callback?.(previous);
        newKeys.forEach((value, key) => setters.current.get(key)?.(value));
        return newArray;
      });
      setKeys(newKeys);
    },
    [setValues, setKeys, keyExtractor]
  );

  return { array: values, setArray, registerSetter, keys };
}

function removeUnusedSetters(setters, keys) {
  setters.current.forEach((_, key) => {
    if (!keys.has(key)) setters.current.delete(key);
  });
}
