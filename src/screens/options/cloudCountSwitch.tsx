import React, { FC, useRef, useState } from "react";
import { DeviceEventEmitter, StyleSheet, Text, View } from "react-native";
import Storage, { StringTypesEnum } from "../../dictionaries/storageHandling";
import Slider from "@react-native-community/slider";
import { EventsEnum } from "../../events";

interface CloudCountSwitchProps {}

const CloudCountSwitch: FC<CloudCountSwitchProps> = ({}) => {
  const [tileCount, setTileCount] = useState<number>(-1);
  const sliderRef = useRef<any>();

  if (tileCount == -1)
    Storage.GetString(StringTypesEnum.CloudCount).then((stringValue) => {
      const numberValue = stringToTilecount(stringValue);
      setTileCount(numberValue);
    });

  const onValChange = (newVal: number) => {
    Storage.SetString(StringTypesEnum.CloudCount, tilecountToString(newVal));
    setTileCount(newVal);
    DeviceEventEmitter.emit(EventsEnum.CloudCountChanged);
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
  const parsed = parseInt(count) || tileValues.default;
  return isInfinite(parsed) ? tileValues.uimax : parsed;
}

function isInfinite(value) {
  return value >= tileValues.uimax;
}

const tileValues = {
  step: 10,
  min: 20,
  max: 70,
  uimax: 80,
  default: 30,
};

export default CloudCountSwitch;
