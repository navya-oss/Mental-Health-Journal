import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={isLoggedIn() ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/journal"
          element={isLoggedIn() ? <Journal /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={isLoggedIn() ? <About /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
