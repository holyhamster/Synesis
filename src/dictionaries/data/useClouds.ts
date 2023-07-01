import React from "react";
import SynonymCollection from "./synonymCollection";
import SynonymCloud, { CrossReference } from "./synonymCloud";
import ColorNormal from "../../screens/synonyms/colorChart/colorNormal";

//react hook that creates word clouds out of synonyms
export function useClouds(
  synonyms: SynonymCollection[],
  colorMap: Map<string, string>,
  sortBy?: string,
  limit?: number
) {
  //build word clouds from synonyms
  const allClouds = React.useMemo(() => CrossReference(synonyms), [synonyms]);

  //sort, apply limits and build an ordered map of clouds
  const sortedClouds = React.useMemo(() => {
    const newSorted = SynonymCloud.GetSorted(
      Array.from(allClouds.values()),
      sortBy
    ).slice(0, isNaN(limit) ? Infinity : limit);

    const orderedMap = new Map(
      newSorted.map((value, order) => [value.name, { value, order }])
    );
    return orderedMap;
  }, [allClouds, limit, sortBy]);

  //set up a timer to move N amount of clouds to rendered array, every cycle
  const staggetTimer = React.useRef<NodeJS.Timer>();
  const [renderedClouds, setRenderedClouds] = React.useState<SynonymCloud[]>(
    []
  );
  React.useEffect(() => {
    staggetTimer.current && clearInterval(staggetTimer.current);

    setRenderedClouds((previous) => {
      const moveNextClouds = (previousClouds) => {
        const newArray = MoveElements(
          sortedClouds,
          previousClouds,
          ELEMENTS_PER_RENDER
        );
        if (sortedClouds.size == newArray.length) clearInterval(previousTimer);
        return newArray;
      };

      const previousTimer = setInterval(() => {
        if (previousTimer == staggetTimer.current)
          setRenderedClouds(moveNextClouds);
        else clearInterval(previousTimer);
      }, TIME_INTERVAL);

      staggetTimer.current = previousTimer;
      return CopyExisting(sortedClouds, previous);
    });
  }, [setRenderedClouds, sortedClouds]);

  //build color normals for clouds
  const previousNormals = React.useRef(new Map<string, ColorNormal>());
  const colorNormals = React.useMemo(() => {
    {
      const newNormals = rebuildNormals(
        Array.from(allClouds.values()),
        colorMap,
        previousNormals.current
      );
      previousNormals.current = newNormals;
      return newNormals;
    }
  }, [colorMap, allClouds]);

  const displayInfo = {
    totalCount: allClouds.size,
    renderedCount: renderedClouds.length,
  };

  return {
    clouds: renderedClouds,
    colorNormals,
    displayInfo,
  };
}

//this reorders and leaves all elements in current that also exist in all
function CopyExisting(
  allElements: OrderedMap<string, SynonymCloud>,
  current: SynonymCloud[]
): SynonymCloud[] {
  const result = [];
  current.forEach((element) => {
    const { order, value } = allElements.get(element?.name) || {};
    if (value) result[order] = value;
  });
  return result;
}

//pushes missing elements from ordered map into an array by a certain amount
function MoveElements<TKey, TValue>(
  final: OrderedMap<TKey, TValue>,
  current: TValue[],
  changesPerCycle: number
) {
  const result = Array.from(current);
  for (let [_, { value, order }] of final.entries()) {
    if (result[order]) continue;
    result[order] = value;
    changesPerCycle--;
    if (changesPerCycle == 0) break;
  }
  return result;
}

//keeps old correct normals
function rebuildNormals(
  clouds: SynonymCloud[],
  newColorMap: Map<string, string>,
  oldNormals: Map<string, ColorNormal>
) {
  const map = new Map<string, ColorNormal>();
  clouds.forEach((cloud) => {
    const oldNormal = oldNormals.get(cloud.name);
    const newNormal = new ColorNormal(cloud.GetWordNormal(), newColorMap);
    if (!newNormal.IsValid) return;
    map.set(
      cloud.name,
      oldNormal?.isEqualTo(newNormal) ? oldNormal : newNormal
    );
  });
  return map;
}

type OrderedMap<T1, T2> = Map<T1, { value: T2; order: number }>;

const TIME_INTERVAL = 250;

const ELEMENTS_PER_RENDER = 20;
