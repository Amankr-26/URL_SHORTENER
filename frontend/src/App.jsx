import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  async function shortenUrl() {
    if (url === "") {
      alert("Please enter a URL");
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
        alert(data.message);
        return;
      }

      setShortUrl(
        `http://localhost:5000/${data.url.short_code}`
      );
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  }

  return (
    <div>
      <h1>URL Shortener</h1>

      <input
        type="text"
        placeholder="Enter your long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={shortenUrl}>
        Shorten URL
      </button>

      {shortUrl && (
        <p>
          Short URL:{" "}
          <a href={shortUrl} target="_blank">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;