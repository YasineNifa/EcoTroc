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

  const handleRequestResourceError = useCallback(
    (err) => {
      const formattedError = formatHttpApiError(err);
      setError(formattedError);
      enqueueSnackbar(formattedError);
    },
    [enqueueSnackbar, setError]
  );

  const getResourceList = useCallback(
    ({ query = "" } = {}) => {
      apiClient
        .get(`/${endpoint}/${query}`, getCommonOptions())
        .then((res) => {
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
      const isFormData = values instanceof FormData;
      apiClient
        .post(`/${endpoint}/`, values, getCommonOptions({ isFormData }))
        .then(() => {
          enqueueSnackbar(`${resourceLabel} added`);
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
      apiClient
        .get(`/${endpoint}/${id}/`, getCommonOptions())
        .then((res) => {
          const { data } = res;
          setResource(data);
        })
        .catch(handleRequestResourceError);
    },
    [endpoint, handleRequestResourceError]
  );

  const updateResource = useCallback(
    (id, values, successCallback) => {
      apiClient
        .patch(`/${endpoint}/${id}/`, values, getCommonOptions())
        .then((res) => {
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
          enqueueSnackbar(`${resourceLabel} updated`);
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
      apiClient
        .delete(`/${endpoint}/${id}/`, getCommonOptions())
        .then(() => {
          enqueueSnackbar(`${resourceLabel} deleted`);
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

  return {
    resourceList,
    getResourceList,
    addResource,
    resource,
    getResource,
    updateResource,
    deleteResource,
    error,
  };
}
