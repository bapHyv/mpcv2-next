import { data, statusCode } from "@/app/actions";

export interface IActionResponse {
  message: string;
  data: data;
  isSuccess: boolean;
  statusCode: statusCode;
}
