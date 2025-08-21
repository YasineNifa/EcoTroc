import React from "react";
import Icon from "../ui/Icon";
import StarIcon from "@mui/icons-material/Star";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link, useNavigate } from "react-router-dom";

function BuyerInfo({ profile }) {
  return (
    <Link to={`/profiles/${profile?.id}`}>
      <div className="flex justify-between items-center cursor-pointer p-2 -ml-2 rounded-md hover:bg-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={profile?.image}
            alt={profile?.user?.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-bold text-sm">{profile?.user?.username}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Icon className="!text-sm text-yellow-500">
                <StarIcon />
              </Icon>
              <span className="ml-1">
                {profile?.rating} ({profile?.reviewsCount} avis)
              </span>
            </div>
          </div>
        </div>
        <Icon>
          <ChevronRightIcon />
        </Icon>
      </div>
    </Link>
  );
}

export default BuyerInfo;
