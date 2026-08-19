import { useEffect, useState } from "react";

// Backend URL comes from frontend/.env
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  // Stores which URL was recently copied
  const [copiedId, setCopiedId] = useState(null);

  // Stores all URLs belonging to the logged-in user
  const [urls, setUrls] = useState([]);

  // Stores the URL entered by the user
  const [originalUrl, setOriginalUrl] = useState("");

  // Stores error and success messages
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // -------------------------------
  // ANALYTICS
  // -------------------------------

  // Total number of URLs created by the user
  const totalLinks = urls.length;

  // Add the click_count of every URL
  const totalClicks = urls.reduce(
    (total, url) => total + url.click_count,
    0
  );

  // Find the URL with the highest number of clicks
  const mostClickedUrl = urls.reduce(
    (mostClicked, url) => {
      if (!mostClicked || url.click_count > mostClicked.click_count) {
        return url;
      }

      return mostClicked;
    },
    null
  );

  // Get logged-in user's information from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // --------------------------------
  // FETCH USER'S URLS WHEN DASHBOARD LOADS
  // --------------------------------

  useEffect(() => {
    fetchUrls();
  }, []);

  // --------------------------------
  // GET ALL URLS OF LOGGED-IN USER
  // --------------------------------

  async function fetchUrls() {
    const token = localStorage.getItem("token");

    // If JWT token doesn't exist, user is not logged in
    if (!token) {
      setError("You are not logged in");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/urls`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Handle backend errors
      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Store URLs received from backend
      setUrls(data.urls);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  }

  // --------------------------------
  // CREATE A NEW SHORT URL
  // --------------------------------

  async function createShortUrl(e) {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setMessage("");

    // Check if input is empty
    if (!originalUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Validate URL before sending it to backend
    try {
      const url = new URL(originalUrl);

      // Only allow HTTP and HTTPS
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        setError("Only HTTP and HTTPS URLs are allowed");
        return;
      }
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/urls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            originalUrl,
          }),
        }
      );

      const data = await response.json();

      // Handle backend error
      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Show success message
      setMessage("URL shortened successfully!");

      // Clear input field
      setOriginalUrl("");

      // Fetch updated URL list
      fetchUrls();
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  }

  // --------------------------------
  // LOGOUT
  // --------------------------------

  function logout() {
    // Remove JWT token
    localStorage.removeItem("token");

    // Remove logged-in user information
    localStorage.removeItem("user");

    // Reload application so Login page appears
    window.location.reload();
  }

  // --------------------------------
  // DASHBOARD UI
  // --------------------------------

  return (
    <div>
      <h1>URL Shortener</h1>

      {/* Show username if user information exists */}
      {user && (
        <h3>
          Welcome, {user.name}
        </h3>
      )}

      {/* Logout button */}
      <button onClick={logout}>
        Logout
      </button>

      <hr />

      {/* --------------------------------
          CREATE SHORT URL
          -------------------------------- */}

      <h2>Create Short URL</h2>

      <form onSubmit={createShortUrl}>
        <input
          type="url"
          placeholder="Enter your long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />

        <button type="submit">
          Shorten URL
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

      <hr />

      {/* --------------------------------
          ANALYTICS
          -------------------------------- */}

      <div>
        <h2>Analytics</h2>

        <p>
          <strong>Total Links:</strong>{" "}
          {totalLinks}
        </p>

        <p>
          <strong>Total Clicks:</strong>{" "}
          {totalClicks}
        </p>

        {/* Show most clicked URL only when a URL exists */}
        {mostClickedUrl && (
          <p>
            <strong>Most Clicked:</strong>{" "}

            <a
              href={`${API_URL}/${mostClickedUrl.short_code}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {API_URL}/{mostClickedUrl.short_code}
            </a>
          </p>
        )}
      </div>

      <hr />

      {/* --------------------------------
          USER'S URL LIST
          -------------------------------- */}

      <h2>My URLs</h2>

      {/* Show this when user has no URLs */}
      {urls.length === 0 && !error && (
        <p>No URLs found.</p>
      )}

      {/* Display every URL */}
      {urls.map((url) => (
        <div key={url.id}>

          {/* Original URL */}
          <p>
            <strong>Original URL:</strong>{" "}
            {url.original_url}
          </p>

          {/* --------------------------------
              SHORT URL + COPY BUTTON
              -------------------------------- */}

          <p>
            <strong>Short URL:</strong>{" "}

            <a
              href={`${API_URL}/${url.short_code}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {API_URL}/{url.short_code}
            </a>

            <button
              onClick={() => {
                // Copy short URL to clipboard
                navigator.clipboard.writeText(
                  `${API_URL}/${url.short_code}`
                );

                // Show "Copied!" for this URL
                setCopiedId(url.id);

                // Change back to "Copy" after 2 seconds
                setTimeout(() => {
                  setCopiedId(null);
                }, 2000);
              }}
            >
              {copiedId === url.id ? "Copied!" : "Copy"}
            </button>
          </p>

          {/* Number of clicks */}
          <p>
            <strong>Clicks:</strong>{" "}
            {url.click_count}
          </p>

          {/* Creation date */}
          <p>
            <strong>Created:</strong>{" "}
            {new Date(url.created_at).toLocaleString()}
          </p>

          {/* --------------------------------
              DELETE URL
              -------------------------------- */}

          <button
            onClick={async () => {
              // Ask user for confirmation
              const confirmed = window.confirm(
                "Are you sure you want to delete this URL?"
              );

              // Stop if user clicks Cancel
              if (!confirmed) {
                return;
              }

              const token = localStorage.getItem("token");

              try {
                const response = await fetch(
                  `${API_URL}/api/urls/${url.id}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const data = await response.json();

                if (response.ok) {
                  alert("URL deleted successfully!");

                  // Reload dashboard to show updated list
                  window.location.reload();
                } else {
                  alert(data.message);
                }
              } catch (error) {
                console.error(error);
                alert("Unable to connect to server");
              }
            }}
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;