import Icon from "../ui/Icon";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InboxIcon from "@mui/icons-material/Inbox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import ProfileDropdown from "../ProfileDropdown";
import { AuthContext } from "../../context/AuthContextProvider";
import useRequestAuth from "../../hooks/useRequestAuth";
import NotificationBell from "../notifications/NotificationBell";

const UserMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { profile, user } = useContext(AuthContext);
  const { logout } = useRequestAuth();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };
  return (
    <div className="relative flex items-center space-x-4" ref={dropdownRef}>
      <Link
        to="/favorite-listings"
        className="text-gray-600 hover:text-teal-600"
      >
        <Icon>
          <FavoriteBorderIcon />
        </Icon>
      </Link>
      <Link to="/messages" className="text-gray-600 hover:text-teal-600">
        <Icon>
          <InboxIcon />
        </Icon>
      </Link>
      <a href="#" className="text-gray-600 hover:text-teal-600">
        <Icon>
          {/* <NotificationsNoneIcon /> */}
          <NotificationBell />
        </Icon>
      </a>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <img
          alt="Avatar de l'utilisateur"
          className="w-8 h-8 rounded-full"
          src={
            profile?.image
              ? profile.image
              : `https://placehold.co/40x40/E2E8F0/4A5568?text=${user?.username}`
          }
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = profile?.image
              ? profile.image
              : `https://placehold.co/40x40/E2E8F0/4A5568?text=${user?.username}`;
          }}
        />
        <Icon className="text-gray-600">
          <ExpandMoreIcon />
        </Icon>
        {isDropdownOpen && (
          <ProfileDropdown profile={profile} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
};

export default UserMenu;
