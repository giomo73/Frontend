import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";
import ResetPassword from "./pages/ResetPassword";
import KundFordon from "./pages/KundFordon";

function App() {
  const [auth, setAuth] = useState(false);

  // Verifica se l'utente è autenticato all'avvio
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false); // Segna l'utente come non autenticato
  };

  return (
    <Router>
      <Routes>
        {/* Mostra sempre la pagina di login all'indirizzo radice */}
        <Route path="/" element={<Login onLogin={() => setAuth(true)} />} />

        {/* Pagina protetta che richiede l'autenticazione */}
        <Route
          path="/kundfordon"
          element={
            auth ? (
              <>
                <button
                  onClick={handleLogout}
                  className="absolute top-4 right-4 text-sm underline text-red-600"
                >
                  Logga ut
                </button>
                <KundFordon />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Pagine per il reset della password */}
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPasswordRequest />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
