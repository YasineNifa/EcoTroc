import React, { useState } from "react";

const ProfileForm = ({ initialBio, onSubmit }) => {
  const [bio, setBio] = useState(initialBio || "");
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(bio, newAvatarFile);
  };

  return (
    <form onSubmit={handleFormSubmit} className="mt-8">
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="bio">
          Your Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tell us a little about yourself..."
        />
      </div>

      <div className="mb-8">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="avatar"
        >
          Change Avatar
        </label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={(e) => setNewAvatarFile(e.target.files[0])}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
      >
        Update Profile
      </button>
    </form>
  );
};

export default ProfileForm;
