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
    <div className="login-container">
      <h2>Login</h2>

      {/* --------------------------------
          LOGIN FORM
          -------------------------------- */}

      <form onSubmit={loginUser} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>

      {/* Success message */}
      {message && (
        <p>{message}</p>
      )}

      {/* Error message */}
      {error && (
        <p>{error}</p>
      )}

      {/* --------------------------------
          SIGN UP
          -------------------------------- */}

      <p>
        Don't have an account?{" "}

        <button
          type="button"
          onClick={onSignup}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;