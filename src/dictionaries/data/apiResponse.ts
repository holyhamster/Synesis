//data returned from parser
export type APIReturnData = SynonymDefinition[];
export type SynonymDefinition = SynonymSet[];
export type SynonymSet = Set<string>;

//processed response from api with an additional field for web response status
export type APIResponse = SuccessResponse | ErrorResponse;
interface SuccessResponse {
  type: "success";
  data: APIReturnData;
}

interface ErrorResponse {
  type: "error";
  errorMessage: string;
}

export enum APIErrorEnum {
  WrongAPIkey = "Server denies request, check API key",
  NoWord = "No word in the database",
}
