import { SynDefColor } from "./colors";

//single word in a synonym cloud
export default interface DataEntry {
  value: string;
  color: SynDefColor;
  count: number;
}
