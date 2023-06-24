import React from "react";

//maintains an array of values
//sends new assigned values to all registered for live updates
export function useValueSynchronizer<T>(
  keyExtractor: (array: T[]) => Map<string, T>
) {
  const [values, setValues] = React.useState<T[]>([]);

  //used to identify setters in an array
  const [keys, setKeys] = React.useState(keyExtractor(values));

  //setters are stored along their keys and called when the value is changed
  type Setter = (val: T) => void;

  const setters = React.useRef(new Map<string, Setter>());

  removeUnusedSetters(setters, keys);

  const registerSetter = React.useCallback((key: string, setter: Setter) => {
    setters.current.set(key, setter);
  }, []);

  //sets the value to state, calls all setters with the new value
  const setArray = React.useCallback(
    (arrayOrCallback: T[] | ((previous) => T[])) => {
      setValues((previous: T[]) => {
        const array =
          typeof arrayOrCallback == "function"
            ? arrayOrCallback(previous)
            : arrayOrCallback;
        const newKeys = keyExtractor(array);
        newKeys.forEach((value, key) => setters.current.get(key)?.(value));
        setKeys(newKeys);
        return array;
      });
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
