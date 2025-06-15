import { Address, UserDataAPIResponse } from "@/app/types/profileTypes";

export type statusCode = 0 | 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 500;
export type data = null | UserDataAPIResponse | Address | { id: string } | {};

export interface IActionResponse {
  message: string;
  data: data;
  isSuccess: boolean;
  statusCode: statusCode;
}
