import RegisterPage from "./pages/RegisterPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import Home from "./pages/Home";
import AppLayout from "./layout/AppLayout";
import RequireAuth from "./pages/RequireAuth";
import RequireNotAuth from "./pages/RequireNotAuth";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RequireNotAuth />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<SigninPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
