import { useState } from "react";
import BioGeneratorModal from "../geminiPowered/BioGeneratorModal";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

const ProfileHeader = ({ profile, navigaterProfile }) => {
  const [isBioModalOpen, setBioModalOpen] = useState(false);
  const [currentBio, setCurrentBio] = useState(profile?.bio);

  return (
    <>
      <div className="bg-white p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={
              profile?.image
                ? profile?.image
                : `https://placehold.co/40x40/E2E8F0/4A5568?text=${profile?.user?.username}`
            }
            alt={profile?.user?.username}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full"
          />
          <div className="flex-1 text-end flex justify-between">
            <div className="flex justify-start flex-col items-start">
              <h1 className="text-2xl font-bold">{profile?.user?.username}</h1>
              <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-500 my-2">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} className="!text-base">
                    {i < Math.round(profile?.rating) ? (
                      <StarIcon />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </Icon>
                ))}
                <span className="text-gray-600 text-sm ml-1">
                  {profile?.reviewsCount} reviews
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-6 text-center md:text-left">
                {profile?.bio}
              </p>
            </div>
            <div>
              {profile?.id === navigaterProfile?.id && (
                <>
                  <Button variant="secondary" className="mr-1">
                    Edit Profile
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setBioModalOpen(true)}
                    // className="mt-2 text-xs !px-2 !py-1"
                  >
                    ✨ Generate Bio with AI
                  </Button>
                </>
              )}
            </div>
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
