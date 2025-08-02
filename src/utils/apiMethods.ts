import axiosInstance from "@/lib/axios";

type Method = "get" | "post" | "put" | "delete" | "patch";

export const apiMethod = async <T>(
  url: string,
  method: Method,
  data: any = {},
  sendToken: boolean = false
): Promise<T> => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data: method !== "get" ? data : undefined,
      params: method === "get" ? data : undefined,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};
