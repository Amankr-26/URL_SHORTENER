import { useState } from "react";

// Backend URL comes from frontend/.env
const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------
  // LOGIN USER
  // --------------------------------

  async function loginUser(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Tell App.jsx login was successful
      onLogin();

      setMessage("Login successful!");

      setEmail("");
      setPassword("");

      console.log("Logged in user:", data.user);
      console.log("JWT:", data.token);

    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-gray-500">
            Login to your URL Shortener account
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={loginUser}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
              outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
              outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white
            font-semibold rounded-xl
            hover:bg-blue-700
            active:scale-[0.98]
            transition duration-200
            shadow-md"
          >
            Login
          </button>

        </form>

        {/* Success Message */}
        {message && (
          <p className="mt-5 text-center text-sm font-medium text-green-600">
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-5 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Signup */}
        <div className="mt-7 pt-6 border-t border-gray-200 text-center">

          <p className="text-gray-600 text-sm">
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={onSignup}
            className="mt-2 text-blue-600 font-semibold
            hover:text-blue-700 hover:underline
            transition"
          >
            Create an account
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;