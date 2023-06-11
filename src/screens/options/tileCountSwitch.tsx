import React, { FC, useRef, useState } from "react";
import { DeviceEventEmitter, StyleSheet, Text, View } from "react-native";
import {
  GetStringFromStorage,
  SetStringInStorage,
  StringTypesEnum,
} from "../../dictionaries/storageHandling";
import Slider from "@react-native-community/slider";
import { EventsEnum } from "../../events";
import { topLeft } from "@shopify/react-native-skia";

interface TileCountSwitchProps {}

const TileCountSwitch: FC<TileCountSwitchProps> = ({}) => {
  const [tileCount, setTileCount] = useState<number>(-1);
  const sliderRef = useRef<any>();

  if (tileCount == -1)
    GetStringFromStorage(StringTypesEnum.TileCount).then((stringValue) => {
      const numberValue = stringToTilecount(stringValue);
      setTileCount(numberValue);
    });

  const onValChange = (newVal: number) => {
    SetStringInStorage(StringTypesEnum.TileCount, tilecountToString(newVal));
    setTileCount(newVal);
    DeviceEventEmitter.emit(EventsEnum.TileCountChanged);
  };
  //console.log((sliderRef?.current).value);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text> Tile limit</Text>
      <Text> {tileCount > tileValues.max ? "No limit" : tileCount}</Text>
      <Slider
        ref={sliderRef}
        style={{
          alignItems: "center",
          width: "90%",
          height: 40,
        }}
        step={tileValues.step}
        value={tileCount}
        minimumValue={tileValues.min}
        maximumValue={tileValues.uimax}
        onValueChange={onValChange}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
    </View>
  );
};

const styles = StyleSheet.create({ view: {} });

function tilecountToString(count: number) {
  return (isInfinite(count) ? 1000 : count).toString();
}

function stringToTilecount(count: string) {
  const parsed = parseInt(count) ?? tileValues.default;
  return isInfinite(parsed) ? tileValues.uimax : parsed;
}

function isInfinite(value) {
  return value >= tileValues.uimax;
}

const tileValues = {
  step: 10,
  min: 20,
  max: 50,
  uimax: 60,
  default: 30,
};

export default TileCountSwitch;
