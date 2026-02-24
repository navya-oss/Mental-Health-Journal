import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <-- import Link and useNavigate
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });

      setMessage(res.data.message);
      setIsError(false);

      // Navigate to login page after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Registration failed");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="bg-black border-2 border-white p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-500">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border-2 border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
          >
            Register
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Login link */}
        <p className="mt-4 text-center text-sm text-white">
          Already registered?{" "}
          <Link to="/login" className="text-purple-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
