import SettingsNavigation from "../../components/Settings/SettingsNavigation";
import ProfileForm from "../../components/Settings/ProfileForm";

const ProfileSettings = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Paramètres</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <SettingsNavigation />
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
