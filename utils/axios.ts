"use server";

import type { AxiosError } from "axios";
import axios from "axios";

import { getSession } from "@/lib/authentication";

const axiosService = () => {
  const defaultOptions = {
    baseURL: process.env.BASE_URL,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();

    if (session) {
      request.headers.Authorization = `Bearer ${session.tokens.accessToken}`;
    }

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log((error as AxiosError).response?.data);

      return Promise.reject(error.response?.data);
    }
  );

  return instance;
};

export default axiosService();
