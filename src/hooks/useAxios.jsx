import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  localServerRoboy,
  mainServer,
  localServerAsha,
} from "../constants/constants";

const useAxios = ({
  url,
  method = "GET",
  transformResponse,
  transformError,
  debounceDelay = 0,
}) => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const debounceTimer = useRef(null);
  const cancelSource = useRef(null);

  // Clean up cancel token when component unmounts
  useEffect(() => {
    return () => {
      if (cancelSource.current) {
        cancelSource.current.cancel("Request canceled due to component unmount.");
      }
    };
  }, []);

  const callApi = useCallback(
    (payload = null) =>
      new Promise((resolve, reject) => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
          setLoading(true);
          setProgress(0);
          cancelSource.current = axios.CancelToken.source();

          try {
            const axiosConfig = {
              url: `${url.includes("/kanini/") ? localServerAsha : localServerRoboy}${url}`,
              method,
              cancelToken: cancelSource.current.token,
              onDownloadProgress: (event) => {
                if (event.total) {
                  const percent = Math.round((event.loaded * 100) / event.total);
                  setProgress(percent);
                }
              },
              onUploadProgress: (event) => {
                if (event.total) {
                  const percent = Math.round((event.loaded * 100) / event.total);
                  setProgress(percent);
                }
              },
            };

            // If GET, use params; else, use data
            if (method.toUpperCase() === "GET" && payload) {
              axiosConfig.params = payload;
            } else if (payload) {
              axiosConfig.data = payload;
            }

            const response = await axios(axiosConfig);

            const transformedData = transformResponse
              ? transformResponse(response)
              : response.data;

            setErrors(null);
            resolve(transformedData);
          } catch (error) {
            if (axios.isCancel(error)) {
              console.warn("API request canceled:", error.message);
            }
            const transformedErr = transformError
              ? transformError(error)
              : error.message;

            setErrors(transformedErr);
            reject(transformedErr);
          } finally {
            setLoading(false);
            setProgress(0);
          }
        }, debounceDelay);
      }),
    [url, method, transformResponse, transformError, debounceDelay]
  );

  const cancelRequest = () => {
    if (cancelSource.current) {
      cancelSource.current.cancel("Request manually canceled.");
    }
  };

  const downloadFile = async (fileUrl, filename) => {
    setLoading(true);
    setProgress(0);
    cancelSource.current = axios.CancelToken.source();

    try {
      const response = await axios({
        url: `${url.includes("/kanini/") ? localServerAsha : localServerRoboy}${fileUrl}`,
        method: "GET",
        responseType: "blob",
        cancelToken: cancelSource.current.token,
        onDownloadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return { callApi, errors, loading, progress, cancelRequest, downloadFile };
};

export default useAxios;
