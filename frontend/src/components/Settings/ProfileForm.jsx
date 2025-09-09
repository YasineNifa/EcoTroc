import React, { useContext, useEffect, useState } from "react";
import UserCircleIcon from "../../components/ui/UserIconCircle";
import { AuthContext } from "../../context/AuthContextProvider";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api";

function ProfileForm() {
  const navigate = useNavigate();
  const { user, profile, setUser, setProfile } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [countries, setCountries] = useState([]);

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    apiClient.get("/countries/").then((res) => {
      setCountries(res.data);
    });
  }, []);

  useEffect(() => {
    setProfileImage(profile?.image);
  }, [profile?.image]);

  const formik = useFormik({
    initialValues: {
      bio: profile?.bio || "",
      image: null,
      username: user?.username,
      first_name: user?.first_name,
      last_name: user?.last_name,
      phone_number: profile?.phone_number,
      country: profile?.country,
      city: profile?.city,
      show_city_in_profile: profile?.show_city_in_profile,
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append("bio", values.bio);
      if (values.image) {
        formData.append("image", values.image);
      }
      formData.append("user.username", values.username);
      formData.append("user.first_name", values.first_name);
      formData.append("user.last_name", values.last_name);

      formData.append("country", values.country);
      formData.append("city", values.city);
      formData.append("show_city_in_profile", values.show_city_in_profile);
      formData.append("phone_number", values.phone_number);

      await apiClient.patch("/profile/me/", formData).then((res) => {
        console.log("res: ", res);
        setSubmitting(false);
        setUser({
          ...user,
          username: values.username,
          first_name: values.first_name,
          last_name: values.last_name,
        });
        setProfile({
          ...profile,
          bio: values.bio,
          image: profileImage,
          country: values.country,
          city: values.city,
          show_city_in_profile: values.show_city_in_profile,
          phone_number: values.phone_number,
        });
        navigate("/");
      });
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="md:col-span-3 flex flex-col gap-8"
    >
      {/* --- Section Informations de Base --- */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon />
              )}
            </div>
            <span className="font-semibold text-gray-700">Your photo</span>
          </div>
          <label className="mt-4 md:mt-0 cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
            Choose photo
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
              name="image"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-gray-200">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              First name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Last name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Phone number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="py-6">
          <label
            htmlFor="bio"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            About you
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
      </div>

      {/* --- Section Localisation --- */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          My position
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Choose your country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-700">
            Display the city in my profile
          </span>
          <button
            type="button"
            onClick={() =>
              formik.setFieldValue(
                "show_city_in_profile",
                !formik.values.show_city_in_profile
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formik.values.show_city_in_profile ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formik.values.show_city_in_profile
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Langue
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      {/* --- Bouton de Mise à Jour --- */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          {formik.isSubmitting ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
