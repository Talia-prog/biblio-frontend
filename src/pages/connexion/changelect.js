import React, { useState } from "react";
import axios from "axios";

function ChangerMotDePasse() {
  const lecteur = JSON.parse(localStorage.getItem("lecteurConnecte"));
  const [ancien, setAncien] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();

    if (nouveau !== confirmation) {
      alert("Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/lecteurs/changer-motdepasse/${lecteur._id}`, {
        ancienMotDePasse: ancien,
        nouveauMotDePasse: nouveau,
      });

      alert(res.data.message);
      setAncien("");
      setNouveau("");
      setConfirmation("");
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || "Impossible de changer le mot de passe."));
    }
  };

  return (
    <div className="mt-6 border p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">Modifier le mot de passe</h3>
      <form onSubmit={handleChange} className="space-y-3">
        <input
          type="password"
          placeholder="Ancien mot de passe"
          className="w-full p-2 border rounded"
          value={ancien}
          onChange={(e) => setAncien(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          className="w-full p-2 border rounded"
          value={nouveau}
          onChange={(e) => setNouveau(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le nouveau mot de passe"
          className="w-full p-2 border rounded"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}

export default ChangerMotDePasse;