import Button from "../ui/Button";
import CategoryNav from "./CategoryNav";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const Header = ({ onSellClick }) => (
  <header className="bg-white border-b sticky top-0 z-10">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-teal-600">EcoTroc</h1>
          <SearchBar />
        </div>
        <div className="flex items-center space-x-6">
          <Button onClick={onSellClick}>Vends tes articles</Button>
          <UserMenu />
        </div>
      </div>
      <CategoryNav />
    </div>
  </header>
);

export default Header;
