import React, { useContext, useEffect, useState } from "react";
import UserCircleIcon from "../../components/ui/UserIconCircle";
import { AuthContext } from "../../context/AuthContextProvider";
import { useFormik } from "formik";
// import useRequestResource from "../../hooks/useRequestResource";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api";

function ProfileForm() {
  const navigate = useNavigate();
  const { user, profile, setUser, setProfile } = useContext(AuthContext);
  //   const { updateResource } = useRequestResource({
  //     endpoint: "profiles",
  //     resourceLabel: "Profile",
  //   });

  //   const [country, setCountry] = useState("France");
  //   const [city, setCity] = useState("Arnouville");
  //   const [language, setLanguage] = useState("French");
  //   const [showCity, setShowCity] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setProfileImage(URL.createObjectURL(file));
    }
  };
  //   const countries = ["France", "Belgique", "Suisse", "Canada"];
  //   const cities = ["Paris", "Lyon", "Marseille", "Arnouville"];
  //   const languages = [
  //     "Français (French)",
  //     "Anglais (English)",
  //     "Espagnol (Spanish)",
  //   ];

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
      {/* <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Ma position
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pays
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ville
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-semibold text-gray-700">
              Afficher la ville dans le profil
            </span>
            <button
              onClick={() => setShowCity(!showCity)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showCity ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showCity ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div> */}

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
