import { useState } from "react";
import axios from "axios";

function ForgotPasswordGestionnaire() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErreur("");

    try {
      const response = await axios.post(`${window.env.REACT_APP_API_URL}/api/gestionnaire/motdepasse-oublie`, {
        email,
      });
      setMessage(response.data.message);
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Mot de passe oublié</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Adresse e-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="votre.email@example.com"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Envoyer le lien de réinitialisation
        </button>
        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {erreur && <p className="text-red-600 text-sm mt-2">{erreur}</p>}
      </form>
    </div>
  );
}

export default ForgotPasswordGestionnaire;