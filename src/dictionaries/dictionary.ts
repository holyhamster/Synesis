import SynDefinition from "../synDefinition";

export interface Dictionary {
  GetSynonyms: (string: string) => Promise<SynDefinition>;
  Check: () => boolean;
}
