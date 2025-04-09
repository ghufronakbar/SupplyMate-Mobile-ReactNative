import { AxiosError, AxiosResponse } from "axios";

export interface APIRes {
  message: string;
}

export interface Api<T = undefined> extends APIRes {
  data: T;
}
