import { useState, type FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";
import { AXIOS_USER } from "../../utils/axios/axios";
import { AxiosError } from "axios";
import { useUserInfoStore } from "../../store/userInfoStore";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await AXIOS_USER.post("/register", {
        username,
        password,
        email,
      });

      const { userId } = response.data;
      const name = response.data.username;

      useUserInfoStore.getState().setUser({
        username: name,
        userId: userId,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
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
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

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
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <Link
        onClick={() => localStorage.clear()}
        to="/"
        className=" text-white  px-4 py-2 absolute bottom-10 bg-gray-500 rounded-md hover:bg-black cursor-pointer"
      >
        Try first
      </Link>
    </div>
  );
};

export default RegisterPage;
