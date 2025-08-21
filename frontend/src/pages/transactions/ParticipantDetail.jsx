import { Link } from "react-router-dom";

const ParticipantDetail = ({ title, profile }) => (
  <div>
    <span className="font-semibold">{title}:</span>
    <Link
      to={`/profiles/${profile.id}`}
      className="flex items-center mt-1 group"
    >
      <img
        src={
          profile.image || `https://i.pravatar.cc/40?u=${profile.user.username}`
        }
        alt={`${profile.user.username}'s avatar`}
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="ml-2 text-gray-800 group-hover:text-blue-600 transition">
        {profile.user.username}
      </span>
    </Link>
  </div>
);

export default ParticipantDetail;
