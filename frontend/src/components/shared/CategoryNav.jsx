const CategoryNav = () => {
  const categories = [
    "Hommes",
    "Femmes",
    "Enfants",
    "Maison",
    "Électronique",
    "Divertissement",
    "Loisirs et collections",
    "Services",
    "Notre plateforme",
  ];

  return (
    <nav className="hidden md:flex items-center space-x-8 py-2 text-sm text-gray-600">
      {categories.map((category) => (
        <a key={category} href="#" className="hover:text-teal-600">
          {category}
        </a>
      ))}
    </nav>
  );
};

export default CategoryNav;
