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

      // Tell App.jsx that login was successful
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
    <div className="min-h-screen flex bg-white">

      {/* ==================================================
          LEFT SIDE - URL SHORTENER INTRO
          ================================================== */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 text-white">

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10" />

        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 rounded-full bg-white/10" />

        <div className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-white/5" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center w-full px-16 xl:px-24">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">

            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm text-2xl">
              🔗
            </div>

            <span className="text-2xl font-bold">
              URL Shortener
            </span>

          </div>

          {/* Main heading */}
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight">

            Shorten.
            <br />

            Share.
            <br />

            Track.

          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-blue-100 max-w-md leading-relaxed">

            Create short links, share them anywhere,
            and keep track of every click in one place.

          </p>

          {/* URL Illustration */}
          <div className="mt-12 relative max-w-md">

            {/* Browser window */}
            <div className="bg-white rounded-2xl p-5 shadow-2xl">

              {/* Browser dots */}
              <div className="flex gap-2 mb-5">

                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />

              </div>

              {/* Long URL */}
              <div className="h-11 bg-gray-100 rounded-lg flex items-center px-4">

                <span className="text-sm text-gray-400 truncate">
                  https://your-long-url.com/your-page
                </span>

              </div>

              {/* Short URL */}
              <div className="mt-4 h-12 border-2 border-blue-500 rounded-lg flex items-center justify-between px-4">

                <span className="text-sm font-semibold text-blue-600">
                  short.ly/abc123
                </span>

                <span className="text-blue-500">
                  📋
                </span>

              </div>

            </div>

            {/* Analytics card */}
            <div className="absolute -right-8 -bottom-8 bg-white rounded-xl shadow-xl p-4 w-36">

              <p className="text-xs text-gray-400">
                Total Clicks
              </p>

              <p className="text-xl font-bold text-gray-800 mt-1">
                12,543
              </p>

              <div className="flex items-end gap-1 h-8 mt-2">

                <div className="w-2 bg-blue-200 rounded-t h-3" />
                <div className="w-2 bg-blue-300 rounded-t h-5" />
                <div className="w-2 bg-blue-400 rounded-t h-4" />
                <div className="w-2 bg-blue-500 rounded-t h-7" />
                <div className="w-2 bg-indigo-500 rounded-t h-6" />
                <div className="w-2 bg-indigo-600 rounded-t h-8" />

              </div>

            </div>

          </div>

        </div>
      </div>


      {/* ==================================================
          RIGHT SIDE - LOGIN
          ================================================== */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">

        <div className="w-full max-w-md">

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">

            {/* Heading */}
            <div className="text-center mb-8">

              <h2 className="text-3xl font-bold text-gray-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-gray-500">
                Login to your account
              </p>

            </div>


            {/* Login Form */}
            <form
              onSubmit={loginUser}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    px-4
                    py-3.5
                    border
                    border-gray-300
                    rounded-xl
                    text-gray-900
                    placeholder-gray-400
                    outline-none
                    transition
                    duration-200
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>


              {/* Password */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    px-4
                    py-3.5
                    border
                    border-gray-300
                    rounded-xl
                    text-gray-900
                    placeholder-gray-400
                    outline-none
                    transition
                    duration-200
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>


              {/* Login Button */}
              <button
                type="submit"
                className="
                  w-full
                  py-3.5
                  bg-blue-600
                  text-white
                  font-semibold
                  rounded-xl
                  shadow-lg
                  shadow-blue-500/20
                  hover:bg-blue-700
                  active:scale-[0.98]
                  transition
                  duration-200
                "
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


            {/* Divider */}
            <div className="flex items-center gap-4 my-7">

              <div className="flex-1 h-px bg-gray-200" />

              <span className="text-sm text-gray-400">
                or
              </span>

              <div className="flex-1 h-px bg-gray-200" />

            </div>


            {/* Sign Up */}
            <div className="text-center">

              <p className="text-sm text-gray-600">
                Don't have an account?
              </p>

              <button
                type="button"
                onClick={onSignup}
                className="
                  mt-2
                  text-blue-600
                  font-semibold
                  hover:text-blue-700
                  hover:underline
                  transition
                "
              >
                Create an account
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;