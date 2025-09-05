import { useState } from "react";
import BioGeneratorModal from "../geminiPowered/BioGeneratorModal";
import Button from "../ui/Button";
import StarRating from "../reviews/StarRating";
import { Link } from "react-router-dom";

const formatLastSeen = (dateString) => {
  if (!dateString) return "Never connected";
  const lastSeenDate = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - lastSeenDate) / 1000);

  if (seconds < 60) return `Seen ${seconds} second${seconds > 1 ? "s" : ""}`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Seen ${minutes} minute${minutes > 1 ? "s" : ""}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Seen ${hours} hour${hours > 1 ? "s" : ""}`;

  return `Seen ${lastSeenDate.toLocaleDateString()}`;
};

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-green-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ProfileHeader = ({
  profile,
  navigaterProfile,
  averageRating,
  reviewCount,
}) => {
  const [isBioModalOpen, setBioModalOpen] = useState(false);
  const [currentBio, setCurrentBio] = useState(profile?.bio);
  const canEdit = profile?.id === navigaterProfile?.id;

  return (
    // <>
    //   <div className="bg-white p-6 md:p-8 mb-6">
    //     <div className="flex flex-col md:flex-row items-center gap-6">
    //       <img
    //         src={
    //           profile?.image
    //             ? profile?.image
    //             : `https://placehold.co/40x40/E2E8F0/4A5568?text=${profile?.user?.username}`
    //         }
    //         alt={profile?.user?.username}
    //         className="w-24 h-24 md:w-32 md:h-32 rounded-full"
    //       />
    //       <div className="flex-1 text-end flex justify-between">
    //         <div className="flex justify-start flex-col items-start">
    //           <h1 className="text-2xl font-bold">{profile?.user?.username}</h1>
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 mb-4">
    //             <div className="space-y-2">
    //               {profile?.show_city_in_profile && profile?.city && (
    //                 <div className="flex items-center gap-2">
    //                   <LocationIcon />
    //                   <span>
    //                     {profile.city}, {profile.country}
    //                   </span>
    //                 </div>
    //               )}
    //               <div className="flex items-center gap-2">
    //                 <ClockIcon />
    //                 <span>{formatLastSeen(profile?.last_login_at)}</span>
    //               </div>
    //             </div>
    //             <div className="space-y-2">
    //               <h3 className="font-semibold text-gray-800 hidden md:block">
    //                 Infos vérifiées
    //               </h3>
    //               {profile?.email_verified ? (
    //                 <div className="flex items-center gap-2">
    //                   <CheckCircleIcon />
    //                   <span>Email</span>
    //                 </div>
    //               ) : (
    //                 <p className="text-gray-500">
    //                   Aucune information vérifiée.
    //                 </p>
    //               )}
    //             </div>
    //           </div>
    //           <div className="flex items-center justify-center md:justify-start gap-1 my-2">
    //             <StarRating rating={averageRating} />
    //             <span className="text-gray-600 text-sm ml-2">
    //               {averageRating.toFixed(1)} ({reviewCount} reviews)
    //             </span>
    //           </div>
    //           <p className="text-sm text-gray-700 mt-6 text-center md:text-left">
    //             {profile?.bio}
    //           </p>
    //         </div>
    //         <div>
    //           {profile?.id === navigaterProfile?.id && (
    //             <>
    //               <Link to="/settings/profile">
    //                 <Button variant="secondary" className="mr-1">
    //                   Edit Profile
    //                 </Button>
    //               </Link>
    //               <Button
    //                 variant="secondary"
    //                 onClick={() => setBioModalOpen(true)}
    //               >
    //                 ✨ Generate Bio with AI
    //               </Button>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <BioGeneratorModal
    //     isOpen={isBioModalOpen}
    //     onClose={() => setBioModalOpen(false)}
    //     onBioGenerated={setCurrentBio}
    //   />
    // </>
    <>
      <div className="bg-white p-6 md:p-8 mb-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Image de profil */}
          <img
            src={
              profile?.image
                ? profile?.image
                : `https://placehold.co/128x128/E2E8F0/4A5568?text=${profile?.user?.username
                    .charAt(0)
                    .toUpperCase()}`
            }
            alt={profile?.user?.username}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-100"
          />

          <div className="flex-1 w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {profile?.user?.username}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-1 my-2">
                  <StarRating rating={averageRating} />
                  <span className="text-gray-600 text-sm ml-2">
                    {averageRating.toFixed(1)} ({reviewCount} avis)
                  </span>
                </div>
              </div>
              {canEdit && (
                <Link to="/settings/profile">
                  <Button variant="secondary">Edit profile</Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 mb-4">
              <div className="space-y-2">
                {profile?.show_city_in_profile && profile?.city && (
                  <div className="flex items-center gap-2">
                    <LocationIcon />
                    <span>
                      {profile.city}, {profile.country}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ClockIcon />
                  <span>{formatLastSeen(profile?.last_login_at)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 hidden md:block">
                  Verified information
                </h3>
                {profile?.email_verified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon />
                    <span>Email</span>
                  </div>
                ) : (
                  <p className="text-gray-500">No information verified.</p>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4 text-left">
              {profile?.bio || "Cet utilisateur n'a pas encore de biographie."}
            </p>

            {/* {canEdit && (
              <div className="mt-4 text-left">
                <Button
                  variant="secondary"
                  onClick={() => setBioModalOpen(true)}
                >
                  ✨ Générer une bio avec l'IA
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </div>

      <BioGeneratorModal
        isOpen={isBioModalOpen}
        onClose={() => setBioModalOpen(false)}
        onBioGenerated={setCurrentBio}
      />
    </>
  );
};

export default ProfileHeader;
