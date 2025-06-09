"use client";

import axios from "axios";
import toast from "react-hot-toast";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
import { Toaster } from "sonner";

// Response interceptor function
const handleResponseError = async (error) => {
  if (error.response) {
    const { status } = error.response;

    if (status === 401) {
      //   await logout();
      console.warn("Authentication failed or token expired");
      toast.error("You were logged out, please login again.");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    if (status === 403) {
      console.warn("Access forbidden");
    }

    if (status >= 500) {
      console.error("Server error:", error.response.data);
    }
  }

  return Promise.reject(error);
};

export const clientGet = async (url, config = {}) => {
  try {
    const headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };

    const response = await axios
      .get(url, {
        ...config,
        headers,
        baseURL,
        withCredentials: true,
      })
      .catch(handleResponseError);

    return response.data;
  } catch (error) {
    console.error(`Error in clientGet to ${url}:`, error);
    throw error;
  }
};

export const clientPost = async (url, data = {}, config = {}) => {
  try {
    const headers = {
      // ...config.headers,
      "Content-Type": "application/json",
    };

    const response = await axios
      .post(url, data, {
        ...config,
        headers,
        baseURL,
        withCredentials: true,
      })
      .catch(handleResponseError);

    return response.data;
  } catch (error) {
    console.error(`Error in clientPost to ${url}:`, error);
    throw error;
  }
};

export const clientPut = async (url, data = {}, config = {}) => {
  try {
    const headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };

    const response = await axios
      .put(url, data, {
        ...config,
        headers,
        baseURL,
        withCredentials: true,
      })
      .catch(handleResponseError);

    return response.data;
  } catch (error) {
    console.error(`Error in clientPut to ${url}:`, error);
    throw error;
  }
};

export const clientPatch = async (url, data = {}, config = {}) => {
  try {
    const headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };

    const response = await axios
      .patch(url, data, {
        ...config,
        headers,
        baseURL,
        withCredentials: true,
      })
      .catch(handleResponseError);

    return response.data;
  } catch (error) {
    console.error(`Error in clientPatch to ${url}:`, error);
    throw error;
  }
};

export const clientDelete = async (url, config = {}) => {
  try {
    const headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };

    const response = await axios
      .delete(url, {
        ...config,
        headers,
        baseURL,
        withCredentials: true,
      })
      .catch(handleResponseError);

    return response.data;
  } catch (error) {
    console.error(`Error in clientDelete to ${url}:`, error);
    throw error;
  }
};

export const clientPostFormData = async (
  url,
  formData,
  config = {},
  onProgress
) => {
  try {
    const headers = { ...config.headers };

    if (onProgress) {
      config.onUploadProgress = onProgress;
    }

    const response = await axios
      .post(url, formData, {
        ...config,
        headers,
        baseURL,
        withCredentials: true,
      })
      .catch(handleResponseError);

    return response.data;
  } catch (error) {
    console.error(`Error uploading FormData to ${url}:`, error);
    throw error;
  }
};

export const clientPatchFormData = async (
  url,
  formData,
  config = {},
  onProgress
) => {
  try {
    const headers = { ...config.headers };

    if (onProgress) {
      config.onUploadProgress = onProgress;
    }

    const response = await axios
      .patch(url, formData, {
        ...config,
        headers,
        baseURL,
        withCredentials: true,
      })
      .catch(handleResponseError);

    return response.data;
  } catch (error) {
    console.error(`Error uploading FormData to ${url}:`, error);
    throw error;
  }
};

export const clientPutFormData = async (
  url,
  formData,
  config = {},
  onProgress
) => {
  try {
    const headers = { ...config.headers };

    if (onProgress) {
      config.onUploadProgress = onProgress;
    }

    const response = await axios
      .put(url, formData, {
        ...config,
        headers,
        baseURL,
        withCredentials: true,
      })
      .catch(handleResponseError);

    return response.data;
  } catch (error) {
    console.error(`Error uploading FormData to ${url}:`, error);
    throw error;
  }
};
