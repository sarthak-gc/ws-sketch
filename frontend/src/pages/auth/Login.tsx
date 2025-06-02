import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AXIOS_USER } from "../../utils/axios/axios";
import { useUserInfoStore } from "../../store/userInfoStore";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await AXIOS_USER.post("/login", {
        username,
        password,
      });
      navigate("/");
      const { userId } = response.data;
      const name = response.data.username;

      useUserInfoStore.getState().setUser({
        username: name,
        userId: userId,
      });
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "radial-gradient(circle, #cacaca 2px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      className="flex items-center justify-center min-h-screen bg-[#dadada]"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={`w-full p-3 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-black"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
