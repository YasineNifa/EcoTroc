import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import axios from "axios";
import getCommonOptions from "../helpers/axios/gtCommonOptions";
import { Formik, Form } from "formik"; // Importez Form pour plus de clarté
import * as yup from "yup";

const validationSchema = yup.object({
  bio: yup.string().required("Bio is required"),
  // Le champ image dans le modèle est facultatif
  image: yup.mixed().nullable(),
});

const Profile = () => {
  const { profile, user, setProfile } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // La fonction qui sera appelée par Formik lors de la soumission
  const handleSubmit = (values, { setSubmitting }) => {
    setError(null);
    setSuccess("");

    const formData = new FormData();
    formData.append("bio", values.bio);
    if (values.image) {
      formData.append("image", values.image);
    }

    const options = getCommonOptions();
    options.headers["Content-Type"] = "multipart/form-data";

    axios
      .patch("http://localhost:8000/api/profile/me/", formData, options)
      .then((res) => {
        setSuccess("Profile updated successfully!");
        setProfile(res.data);
        // Idéalement, mettez à jour votre contexte de profil ici avec res.data
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setError("Failed to update profile. Please check the data.");
      })
      .finally(() => {
        setSubmitting(false); // Indique à Formik que la soumission est terminée
      });
  };

  // Si le profil n'est pas encore chargé, on peut afficher un message
  if (!profile) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Your Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={
              profile.image || `https://i.pravatar.cc/150?u=${user.username}`
            }
            alt="User image"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
          />
          <h3 className="text-2xl font-semibold mt-4">{user.username}</h3>
        </div>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        {success && (
          <p className="mb-4 text-green-500 text-center">{success}</p>
        )}

        <Formik
          initialValues={{
            bio: profile.bio || "",
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ getFieldProps, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="bio"
                >
                  Your Bio
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Tell us a little about yourself..."
                  {...getFieldProps("bio")}
                />
              </div>

              <div className="mb-8">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="image"
                >
                  Change Image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-gray-400"
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Profile;
