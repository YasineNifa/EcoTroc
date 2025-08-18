import Button from "../ui/Button";
import CategoryNav from "./CategoryNav";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="bg-white border-b sticky top-0 z-10">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-8">
          <Link to="/">
          <h1 className="text-2xl font-bold text-teal-600">EcoTroc</h1>
          </Link>
          <SearchBar />
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/listings/create">
            <Button>Vends tes articles</Button>
          </Link>
          <UserMenu />
        </div>
      </div>
      <CategoryNav />
    </div>
  </header>
);

export default Header;
