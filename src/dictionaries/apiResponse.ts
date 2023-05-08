export enum APIErrorEnum {
  WrongAPIkey = "Server denies request, check API key",
  NoWord = "No word in the database",
}

//ordered response from api with an additional field for web response status
export type APIResponse = SuccessResponse | ErrorResponse;

interface SuccessResponse {
  type: "success";
  data: string[][][];
}

interface ErrorResponse {
  type: "error";
  errorMessage: string;
}
