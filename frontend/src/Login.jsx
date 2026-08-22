import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loginUser(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin();
      setMessage("Login successful!");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Left side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-16 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-12">🔗 URL Shortener</h2>

          <h1 className="text-6xl font-bold leading-tight">
            Shorten.
            <br />
            Share.
            <br />
            Track.
          </h1>

          <p className="mt-6 text-lg text-blue-100 max-w-md">
            Create short links, share them anywhere,
            and track every click.
          </p>

          <div className="mt-12 bg-white rounded-2xl p-5 max-w-md shadow-2xl">
            <div className="h-10 bg-gray-100 rounded-lg mb-4" />

            <div className="h-12 border-2 border-blue-500 rounded-lg
              flex items-center px-4 text-blue-600 font-semibold">
              short.ly/abc123
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold text-center">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Login to your account
          </p>

          <form onSubmit={loginUser} className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl outline-none
              focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl outline-none
              focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold
              rounded-xl hover:bg-blue-700 transition"
            >
              Login
            </button>

          </form>

          {message && (
            <p className="text-center text-green-600 mt-4">
              {message}
            </p>
          )}

          {error && (
            <p className="text-center text-red-600 mt-4">
              {error}
            </p>
          )}

          <div className="border-t mt-6 pt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSignup}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;