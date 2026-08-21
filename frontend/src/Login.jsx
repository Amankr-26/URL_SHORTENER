import { useState } from "react";
import "./App.css";

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

    // Clear previous messages
    setMessage("");
    setError("");

    try {
      // Send login request to backend
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

      // Handle login errors from backend
      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Store JWT token in localStorage
      localStorage.setItem("token", data.token);

      // Store logged-in user's information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Tell App.jsx that login was successful
      onLogin();

      // Show success message
      setMessage("Login successful!");

      // Clear input fields
      setEmail("");
      setPassword("");

      // Useful for testing/debugging
      console.log("Logged in user:", data.user);
      console.log("JWT:", data.token);

    } catch (error) {
      console.error(error);

      // This happens when frontend cannot reach backend
      setError("Unable to connect to server");
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Login
      </h2>

      <form onSubmit={loginUser} className="space-y-5">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

      </form>

      {message && (
        <p className="mt-4 text-center text-green-600">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-4 text-center text-red-600">
          {error}
        </p>
      )}

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{" "}

        <button
          type="button"
          onClick={onSignup}
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign Up
        </button>
      </p>

    </div>

  </div>
);
}

export default Login;