// pages/MotDePasseOublieLecteur.jsx

import { useState } from "react";
import axios from "axios";

export default function MotDePasseOublieLecteur() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErreur("");

    try {
      const res = await axios.post(`${window.env.REACT_APP_API_URL}/api/lecteurs/motdepasse-oublie`, { email });
      setMessage(res.data.message);
    } catch (err) {
      if (err.response) {
        setErreur(err.response.data.message);
      } else {
        setErreur("Une erreur s'est produite.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Mot de passe oublié (Lecteur)</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Adresse email :</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Envoyer le lien de réinitialisation
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {erreur && <p className="text-red-600 mt-4">{erreur}</p>}
    </div>
  );
}