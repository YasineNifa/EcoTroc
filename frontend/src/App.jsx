import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RequireAuth from "./pages/AuthPages/RequireAuth";
import RequireNotAuth from "./pages/AuthPages/RequireNotAuth";
import RegisterPage from "./pages/AuthPages/RegisterPage";
import SigninPage from "./pages/AuthPages/SigninPage";
import ListingForm from "./pages/ListingPages/form";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RequireNotAuth />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<SigninPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings/create" element={<ListingForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
