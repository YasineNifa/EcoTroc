import Icon from "../ui/Icon";

const UserMenu = () => (
  <div className="hidden md:flex items-center space-x-6">
    <a href="#" className="text-gray-600 hover:text-teal-600">
      <Icon>favorite_border</Icon>
    </a>
    <a href="#" className="text-gray-600 hover:text-teal-600">
      <Icon>inbox</Icon>
    </a>
    <a href="#" className="text-gray-600 hover:text-teal-600">
      <Icon>notifications_none</Icon>
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
      <Icon className="text-gray-600">expand_more</Icon>
    </div>
  </div>
);

export default UserMenu;
