export type CommonResponseDataType<T = null> = {
  status: "SUCCESS" | "FAIL";
  message: string | null;
  data: T;
};
