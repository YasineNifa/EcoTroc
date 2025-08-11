import { useCallback, useState, useContext } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import apiClient from "../services/api";

import formatHttpApiError from "../helpers/formatHttpApiError";
import getCommonOptions from "../helpers/axios/gtCommonOptions";
import { LoadingOverlayResourceContext } from "../components/LoadingOverlayResource";

export default function useRequestResource({ endpoint, resourceLabel }) {
  const [resourceList, setResourceList] = useState({
    results: [],
  });
  const [resource, setResource] = useState(null);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const loadingOverlay = useContext(LoadingOverlayResourceContext);
  const { setLoading } = loadingOverlay;

  const handleRequestResourceError = useCallback(
    (err) => {
      const formattedError = formatHttpApiError(err);
      setError(formattedError);
      setLoading(false);
      enqueueSnackbar(formattedError);
    },
    [enqueueSnackbar, setError, setLoading]
  );

  const getResourceList = useCallback(
    ({ query = "" } = {}) => {
      setLoading(true);
      apiClient
        .get(`/${endpoint}/${query}`, getCommonOptions())
        .then((res) => {
          setLoading(false);
          console.log("Result : ", res.data);
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
    [endpoint, handleRequestResourceError, setLoading]
  );

  const addResource = useCallback(
    (values, successCallback) => {
      setLoading(true);
      apiClient
        .post(`/${endpoint}/`, values, getCommonOptions())
        .then(() => {
          setLoading(false);
          enqueueSnackbar(`${resourceLabel} added`);
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
      setLoading,
    ]
  );

  const getResource = useCallback(
    (id) => {
      setLoading(true);
      apiClient
        .get(`/${endpoint}/${id}/`, getCommonOptions())
        .then((res) => {
          setLoading(false);
          const { data } = res;
          setResource(data);
        })
        .catch(handleRequestResourceError);
    },
    [endpoint, handleRequestResourceError, setLoading]
  );

  const updateResource = useCallback(
    (id, values, successCallback) => {
      setLoading(true);
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
          setLoading(false);
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
      setLoading,
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
      setLoading,
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
