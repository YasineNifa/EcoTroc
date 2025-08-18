import Icon from "../ui/Icon";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InboxIcon from "@mui/icons-material/Inbox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ProfileDropdown from "../ProfileDropdown";

const UserMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
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
    console.log("User logged out");
    setDropdownOpen(false);
    // Add your logout logic here
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
      <a href="#" className="text-gray-600 hover:text-teal-600">
        <Icon>
          <InboxIcon />
        </Icon>
      </a>
      <a href="#" className="text-gray-600 hover:text-teal-600">
        <Icon>
          <NotificationsNoneIcon />
        </Icon>
      </a>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <img
          alt="Avatar de l'utilisateur"
          className="w-8 h-8 rounded-full"
          src="https://placehold.co/40x40/E2E8F0/4A5568?text=User"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/40x40/E2E8F0/4A5568?text=User";
          }}
        />
        <Icon className="text-gray-600">
          <ExpandMoreIcon />
        </Icon>
        {isDropdownOpen && <ProfileDropdown onLogout={handleLogout} />}
      </div>
    </div>

    // <div className="relative flex items-center space-x-4" ref={dropdownRef}>
    //   <a href="#" className="text-gray-600 hover:text-teal-600 hidden sm:block">
    //     <Icon>inbox</Icon>
    //   </a>
    //   <a
    //     href="#"
    //     className="text-red-500 hover:text-red-700 hidden sm:block relative"
    //   >
    //     <Icon>notifications</Icon>
    //     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
    //       1
    //     </span>
    //   </a>
    //   <button
    //     onClick={() => onNavigate("liked")}
    //     className="text-gray-600 hover:text-teal-600 hidden sm:block"
    //   >
    //     <Icon>favorite_border</Icon>
    //   </button>

    //   <div
    //     className="flex items-center space-x-1 cursor-pointer"
    //     onClick={() => setDropdownOpen(!isDropdownOpen)}
    //   >
    //     <img
    //       alt="User Avatar"
    //       className="w-8 h-8 rounded-full"
    //       src="https://placehold.co/40x40/E2E8F0/4A5568?text=U"
    //     />
    //     <Icon className="text-base text-gray-600">expand_more</Icon>
    //   </div>

    //   {isDropdownOpen && (
    //     <ProfileDropdown onNavigate={onNavigate} onLogout={handleLogout} />
    //   )}
    // </div>
  );
};

export default UserMenu;
