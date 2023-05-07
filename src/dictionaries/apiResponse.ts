export enum APIErrorEnum {
  WrongAPIkey = "Server denies request, check API key",
  NoWord = "No word in the database",
}

interface SuccessResponse {
  type: "success";
  data: string[][][];
}

interface ErrorResponse {
  type: "error";
  errorMessage: string;
}

export type APIResponse = SuccessResponse | ErrorResponse;
