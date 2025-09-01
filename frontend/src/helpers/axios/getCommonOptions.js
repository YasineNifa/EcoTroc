function getCommonOptions(options = {}) {
  const { isFormData = false } = options;
  const headers = {
    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  };
  return { headers };
}

export default getCommonOptions;
