import React, { useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../logo";
function InscriptionLecteur() {
  const [form, setForm] = useState({
    nom: "",
    poste: "",
    email: "",
    motdepasse: "",
  });
  const [message, setMessage] = useState("");
const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/lecteurs/inscription`, form);
    setMessage(res.data.message || "Compte créé avec succès !");
    setForm({ nom: "", poste: "", email: "", motdepasse: "" });

    // Récupérer juste le nom et le poste du lecteur
    const lecteurConnecte = {
      nom: form.nom,
      poste: form.poste,
      email: form.email,
    };

    // Stocker dans localStorage
    localStorage.setItem("lecteurConnecte", JSON.stringify(lecteurConnecte));

    // Rediriger vers la page lecteur
    navigate("/pagelecteur");
  } catch (err) {
    setMessage(err.response?.data?.message || "Erreur lors de l'inscription");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4 "
      >
        <div className="w-24 h-24 mb-4 bg-white border rounded-lg flex mx-auto ">
              <Logo size={100} />
            </div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Inscription à OpenShelf BEAC</h2>

        <input
          type="text"
          name="nom"
          placeholder="Nom complet"
          value={form.nom}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <select
          name="poste"
          value={form.poste}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        >
          <option value="">-- Poste --</option>
          <option value="stagiaire">Stagiaire</option>
          <option value="agent">Agent</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Adresse e-mail"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="password"
          name="motdepasse"
          placeholder="Mot de passe"
          value={form.motdepasse}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          S'inscrire
        </button>
<p className="mt-4 text-sm text-center">
  Vous avez déjà un compte ?{" "}
  <Link to="/lecteur/connexion" className="text-blue-600 underline">
    connectez vous !
  </Link>
</p>
        {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
      </form>
      
    </div>
  );
}

export default InscriptionLecteur;