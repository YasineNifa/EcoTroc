import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useRequestAuth from "../../hooks/useRequestAuth";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

function SigninPage() {
  const { login } = useRequestAuth();
  const navigate = useNavigate();

  const successCallback = () => {
    navigate("/");
  };
  const handleSubmit = (values) => {
    login(values, successCallback);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Ecotroc Logo"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
        >
          {(formik) => {
            return (
              <form
                onSubmit={formik.handleSubmit}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="mt-10 gap-x-6 gap-y-8">
                  <div className="mt-3">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="name"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        username
                      </label>
                      <div className="mt-2">
                        <div
                          className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2 ${
                            formik.touched.username && formik.errors.username
                              ? "outline-red-500 focus-within:outline-red-500"
                              : "outline-gray-300 focus-within:outline-indigo-600"
                          }`}
                        >
                          <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="username"
                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                            {...formik.getFieldProps("username")}
                          />
                        </div>
                      </div>
                    </div>
                    {formik.touched.username && formik.errors.username && (
                      <p className="mt-2 text-sm text-red-600">
                        {formik.errors.username}
                      </p>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="password"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        password
                      </label>
                      <div className="mt-2">
                        <div
                          className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2 ${
                            formik.touched.password && formik.errors.password
                              ? "outline-red-500 focus-within:outline-red-500"
                              : "outline-gray-300 focus-within:outline-indigo-600"
                          }`}
                        >
                          <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="password"
                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                            {...formik.getFieldProps("password")}
                          />
                        </div>
                      </div>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="submit"
                    className=" block min-w-0 grow py-1.5 pr-3 pl-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default SigninPage;
