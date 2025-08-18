import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RequireAuth from "./pages/AuthPages/RequireAuth";
import RequireNotAuth from "./pages/AuthPages/RequireNotAuth";
import RegisterPage from "./pages/AuthPages/RegisterPage";
import SigninPage from "./pages/AuthPages/SigninPage";
import ListingForm from "./pages/ListingPages/form";
import FavoriteList from "./pages/ListingPages/favoriteList";
import MainLayout from "./layout/main";
import Listings from "./pages/ListingPages/list";
import ProfilePage from "./pages/ProfilePage/profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RequireNotAuth />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<SigninPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/" index element={<Listings />} />
            <Route path="/listings/create" element={<ListingForm />} />
            <Route path="/favorite-listings" element={<FavoriteList />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
