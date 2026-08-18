import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  async function shortenUrl() {
    setError("");
    setShortUrl("");

    if (url === "") {
      setError("Please enter a URL");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setShortUrl(
        `http://localhost:5000/${data.url.short_code}`
      );
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>URL Shortener</h1>

        <p className="subtitle">
          Shorten your long URLs quickly and easily.
        </p>

        <div className="form">
          <input
            type="text"
            placeholder="Enter your long URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button onClick={shortenUrl}>
            Shorten URL
          </button>
        </div>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {shortUrl && (
          <div className="result">
            <p>Your shortened URL:</p>

            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;