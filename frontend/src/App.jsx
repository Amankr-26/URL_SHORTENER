import { useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  if (isLoggedIn) {
    return <Dashboard />;
  }

  if (showRegister) {
    return (
      <Register
        onRegister={() => setShowRegister(false)}
      />
    );
  }

  return (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      onSignup={() => setShowRegister(true)}
    />
  );
}

export default App;