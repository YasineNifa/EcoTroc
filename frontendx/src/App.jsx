import RegisterPage from "./pages/RegisterPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import Home from "./pages/Home";
import AppLayout from "./layout/AppLayout";
import RequireAuth from "./pages/RequireAuth";
import RequireNotAuth from "./pages/RequireNotAuth";
import MessagesPage from "./pages/MessagePage";
import TransactionPage from "./pages/TransactionPage";
import Profilex from "./pages/Profilex";
import ListingDetail from "./pages/ListingDetail";
import Test from "./pages/test";
import Test2 from "./pages/test_2";
import HomePage from "./pages/Home";
import HomePagex from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RequireNotAuth />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<SigninPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<Test />} path="/test"></Route>
          <Route element={<Test2 />} path="/test2"></Route>
          <Route element={<HomePagex />} path="/test3"></Route>

          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/listings/:listingId" element={<ListingDetail />} />

            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/profile" element={<Profilex />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route
              path="/messages/:conversationId"
              element={<MessagesPage />}
            />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route
              path="/transactions/:transactionId"
              element={<TransactionPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
