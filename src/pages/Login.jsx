import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [felmeddelande, setFelmeddelande] = useState("");
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setFelmeddelande(""); // Reset error message

    try {
      // Invia la richiesta POST al backend
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      // Verifica se la risposta è OK
      if (!res.ok) {
        // Se la risposta non è OK, gestisci l'errore
        const errorData = await res.json(); // Prova a recuperare il messaggio di errore dal server
        throw new Error(errorData.detail || "Errore sconosciuto durante il login");
      }

      // Se la risposta è OK, processa il JSON e salva il token
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token); // Salva il token nel localStorage
        onLogin(); // Segna l'utente come autenticato
        navigate("/kundfordon"); // Fai il redirect alla pagina successiva
      } else {
        throw new Error("Token non trovato nella risposta.");
      }
    } catch (err) {
      setFelmeddelande("Inloggning misslyckades: " + err.message); // Mostra l'errore se c'è un problema
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl border-t-8 border-blue-600">
        <img
          src="/logo.png"
          alt="Företagslogotyp"
          className="block mx-auto mb-6 w-24 h-24 object-contain"
        />
        <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700">
          Välkommen tillbaka
        </h2>

        <form onSubmit={handleLogin} className="space-y-6 flex flex-col items-center">
          <div className="w-full flex flex-col items-center space-y-2">
            <label className="w-[28rem] text-center text-sm font-semibold text-gray-700">
              E-post
            </label>
            <input
              type="email"
              placeholder="E-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded w-[28rem] max-w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="w-full flex flex-col items-center space-y-2">
            <label className="w-[28rem] text-center text-sm font-semibold text-gray-700">
              Lösenord
            </label>
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded w-[28rem] max-w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
          >
            Logga in
          </button>

          <p className="mt-4 text-sm text-blue-700 hover:underline cursor-pointer">
            Glömt lösenord?
          </p>
        </form>

        {felmeddelande && (
          <p className="text-red-600 text-center mt-4">{felmeddelande}</p>
        )}
      </div>
    </div>
  );
}
