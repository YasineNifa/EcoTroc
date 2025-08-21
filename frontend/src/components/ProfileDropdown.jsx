import { Link } from "react-router-dom";

const ProfileDropdown = ({ profile, onLogout }) => {
  const menuItems = [
    { label: "My Profile", navigation: `/profile/${profile?.user?.username}` },
    { label: "Settings" },
    { label: "Personalization" },
    {
      label: "My Wallet",
      value: `${profile?.jeton_balance} tokens`,
    },
    { label: "My Orders" },
    { label: "Donations" },
    { label: "Invite Friends" },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
      <ul>
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.navigation}
              className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span>{item.label}</span>
              {item.value && (
                <span className="text-gray-500">{item.value}</span>
              )}
            </Link>
          </li>
        ))}
        <li>
          <hr className="my-2 border-gray-100" />
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Log out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
