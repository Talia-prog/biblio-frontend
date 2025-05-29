import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordLecteur() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [motdepasse, setMotdepasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErreur("");

    if (motdepasse !== confirmation) {
      return setErreur("Les mots de passe ne correspondent pas.");
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/lecteurs/reset-password`, {
        token,
        motdepasse,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/lecteur/connexion"); // Redirection vers la page de connexion
      }, 3000);
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
      <h2 className="text-xl font-semibold mb-4">Réinitialiser le mot de passe (Lecteur)</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Nouveau mot de passe :</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          value={motdepasse}
          onChange={(e) => setMotdepasse(e.target.value)}
          required
        />
        <label className="block mb-2">Confirmer le mot de passe :</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Réinitialiser
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {erreur && <p className="text-red-600 mt-4">{erreur}</p>}
    </div>
  );
}