import Icon from "../ui/Icon";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InboxIcon from "@mui/icons-material/Inbox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const UserMenu = () => (
  <div className="hidden md:flex items-center space-x-6">
    <a href="#" className="text-gray-600 hover:text-teal-600">
      <Icon>
        <FavoriteBorderIcon />
      </Icon>
    </a>
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
    <div className="flex items-center space-x-2 cursor-pointer">
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
    </div>
  </div>
);

export default UserMenu;
