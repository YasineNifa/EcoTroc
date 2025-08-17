import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import useRequestAuth from "../hooks/useRequestAuth";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const initialValues = {
  username: "",
  email: "",
  password: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useRequestAuth();

  const successCallback = () => {
    navigate("/signin");
  };
  const handleSubmit = (values) => {
    register(values, successCallback);
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
          Register
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
                        htmlFor="email"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        email
                      </label>
                      <div className="mt-2">
                        <div
                          className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2 ${
                            formik.touched.email && formik.errors.email
                              ? "outline-red-500 focus-within:outline-red-500"
                              : "outline-gray-300 focus-within:outline-indigo-600"
                          }`}
                        >
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="email"
                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                            {...formik.getFieldProps("email")}
                          />
                        </div>
                      </div>
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {formik.errors.email}
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

                  {/* <div className="sm:col-span-3">
                      <label
                        htmlFor="country_id"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Country
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="country_id"
                          name="country_id"
                          autoComplete="country-name"
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          {...formik.getFieldProps("country_id")}
                        >
                          <option value="" disabled>
                            Please select a country
                          </option>
                          {countries.map((country) => {
                            return (
                              <option key={country.id} value={country.id}>
                                {country.name}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </div>
                    </div> */}
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    className="text-sm/6 font-semibold text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            );
          }}
        </Formik>
        {/* <Formik
            initialValues={initialValues}
            validationSchema={RegistrationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="username"
                        required
                        autoComplete="username"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        {...formik.getFieldProps("username")}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        {...formik.getFieldProps("email")}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Password
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        {...formik.getFieldProps("password")}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik> */}
      </div>
    </div>
  );
}

export default RegisterPage;
