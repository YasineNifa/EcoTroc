import React from "react";

function SettingsNavigation() {
  const navItems = [
    "Informations du profil",
    "Paramètres du compte",
    "Envoi",
    "Paiements",
    "Réduction sur les lots",
    "Notifications",
    "Paramètres de confidentialité",
    "Sécurité",
  ];
  const activeItem = "Informations du profil";
  return (
    <aside className="md:col-span-1">
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className={`px-4 py-2 text-sm rounded-md ${
              item === activeItem
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default SettingsNavigation;
