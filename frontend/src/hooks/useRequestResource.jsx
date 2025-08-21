import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";
import apiClient from "../services/api";

import formatHttpApiError from "../helpers/formatHttpApiError";
import getCommonOptions from "../helpers/axios/getCommonOptions";

export default function useRequestResource({ endpoint, resourceLabel }) {
  const [resourceList, setResourceList] = useState({
    results: [],
  });
  const [resource, setResource] = useState(null);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);

  const handleRequestResourceError = useCallback(
    (err) => {
      const formattedError = formatHttpApiError(err);
      setError(formattedError);
      enqueueSnackbar(formattedError, { variant: "error" });
      setLoading(false);
    },
    [enqueueSnackbar, setError]
  );

  const getResourceList = useCallback(
    ({ query = "" } = {}) => {
      setLoading(true);
      apiClient
        .get(`/${endpoint}/${query}`, getCommonOptions())
        .then((res) => {
          setLoading(false);
          setError(null);
          if (res.data.results) {
            setResourceList(res.data);
          } else {
            setResourceList({
              results: res.data,
            });
          }
        })
        .catch(handleRequestResourceError);
    },
    [endpoint, handleRequestResourceError]
  );

  const addResource = useCallback(
    (values, successCallback) => {
      setLoading(true);
      const isFormData = values instanceof FormData;
      apiClient
        .post(`/${endpoint}/`, values, getCommonOptions({ isFormData }))
        .then(() => {
          setLoading(false);
          setError(null);
          enqueueSnackbar(`${resourceLabel} added`, { variant: "success" });
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestResourceError);
    },
    [endpoint, enqueueSnackbar, resourceLabel, handleRequestResourceError]
  );

  const getResource = useCallback(
    (id) => {
      setLoading(true);
      apiClient
        .get(`/${endpoint}/${id}/`, getCommonOptions())
        .then((res) => {
          const { data } = res;
          setResource(data);
          setLoading(false);
          setError(null);
        })
        .catch(handleRequestResourceError);
    },
    [endpoint, handleRequestResourceError]
  );

  const updateResource = useCallback(
    (id, values, successCallback) => {
      setLoading(true);
      const isFormData = values instanceof FormData;
      apiClient
        .patch(`/${endpoint}/${id}/`, values, getCommonOptions({ isFormData }))
        .then((res) => {
          setLoading(false);
          setError(null);
          const updated = res.data;
          const newResourceList = {
            results: resourceList.results.map((r) => {
              if (r.id === id) {
                return updated;
              }
              return r;
            }),
            count: resourceList.count,
          };
          setResourceList(newResourceList);
          enqueueSnackbar(`${resourceLabel} updated`, { variant: "success" });
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestResourceError);
    },
    [
      endpoint,
      enqueueSnackbar,
      resourceLabel,
      handleRequestResourceError,
      resourceList,
    ]
  );

  const deleteResource = useCallback(
    (id) => {
      setLoading(true);
      apiClient
        .delete(`/${endpoint}/${id}/`, getCommonOptions())
        .then(() => {
          setLoading(false);
          setError(null);
          enqueueSnackbar(`${resourceLabel} deleted`, { variant: "success" });
          const newResourceList = {
            results: resourceList.results.filter((r) => {
              return r.id !== id;
            }),
          };
          setResourceList(newResourceList);
        })
        .catch(handleRequestResourceError);
    },
    [
      endpoint,
      resourceList,
      enqueueSnackbar,
      resourceLabel,
      handleRequestResourceError,
    ]
  );

  const toggleLike = useCallback(
    (id, successCallback) => {
      setLoading(true);
      apiClient
        .post(`/${endpoint}/${id}/toggle_like/`, {}, getCommonOptions())
        .then((res) => {
          setLoading(false);
          setError(null);
          enqueueSnackbar("Like status updated!", { variant: "success" });
          if (successCallback) {
            successCallback(res.data);
          }
        })
        .catch(handleRequestResourceError);
    },
    [endpoint, enqueueSnackbar, handleRequestResourceError]
  );

  return {
    resourceList,
    getResourceList,
    addResource,
    resource,
    getResource,
    updateResource,
    deleteResource,
    error,
    toggleLike,
    isLoading,
  };
}
