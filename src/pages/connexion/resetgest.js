import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPasswordGestionnaire() {
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
      const res = await axios.post(`${window.env.REACT_APP_API_URL}/api/gestionnaire/reset-password`, {
        token,
        nouveauMotdepasse: motdepasse,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/gestionnaire"); // Redirige après 3 sec vers la page de connexion
      }, 3000);
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            required
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder=""
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirmer le mot de passe</label>
          <input
            type="password"
            required
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder=""
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Réinitialiser le mot de passe
        </button>
        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {erreur && <p className="text-red-600 text-sm mt-2">{erreur}</p>}
      </form>
    </div>
  );
}

export default ResetPasswordGestionnaire;