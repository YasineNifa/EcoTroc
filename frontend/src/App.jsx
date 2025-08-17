import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RequireAuth from "./pages/RequireAuth";
import RequireNotAuth from "./pages/RequireNotAuth";
import RegisterPage from "./pages/RegisterPage";
import SigninPage from "./pages/SigninPage";

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
