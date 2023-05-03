import SynDefinition from "../synDefinition";

export default interface Dictionary {
  GetSynonyms: (string: string) => Promise<string[][][]>;
  Check: () => boolean;
}
