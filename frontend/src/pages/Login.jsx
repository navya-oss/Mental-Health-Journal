import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);

      // Show success message
      setMessage(res.data.message);
      setIsError(false);

      // Navigate to home after a short delay
      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="bg-black border-2 border-white p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-500">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border-2 border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-white bg-black text-white rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
          >
            Login
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
      </div>
    </div>
  );
}

export default Login;
