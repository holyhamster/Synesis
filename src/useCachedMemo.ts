import React, { useMemo, useRef } from "react";

//memo with access to its previous value
export default function useCachedMemo<T>(
  callback: (T) => T | undefined,
  deps: React.DependencyList
) {
  const ref = useRef<T>(undefined);
  return useMemo(() => {
    const newVal = callback(ref.current);
    ref.current = newVal;
    return newVal;
  }, deps);
}
