import Icon from "../ui/Icon";

const SearchBar = () => (
  <div className="relative hidden md:block">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      search
    </Icon>
    <input
      className="border rounded-md py-2 pl-10 pr-4 w-96 focus:outline-none focus:ring-2 focus:ring-teal-500"
      placeholder="Rechercher des articles"
      type="text"
    />
  </div>
);

export default SearchBar;
