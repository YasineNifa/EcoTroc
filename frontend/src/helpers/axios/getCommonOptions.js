function getCommonOptions(options = {}) {
  const { isFormData = false } = options;
  // const authToken = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  };
  // if (authToken) {
  //   headers["Authorization"] = `Token ${authToken}`;
  // }

  return { headers };
}

export default getCommonOptions;
