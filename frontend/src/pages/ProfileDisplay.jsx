import React from "react";

const ProfileDisplay = ({ user, profile }) => (
  <div className="flex flex-col items-center text-center">
    <img
      src={profile.image || `https://i.pravatar.cc/150?u=${user.username}`}
      alt="User Avatar"
      className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
    />
    <h2 className="text-3xl font-bold mt-4 text-gray-800">{user.username}</h2>
    <p className="text-gray-600">{user.email}</p>
    <div className="mt-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold">
      {profile.jeton_balance} 🪙 Jetons
    </div>
  </div>
);

export default ProfileDisplay;
