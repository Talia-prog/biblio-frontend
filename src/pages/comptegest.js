import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle, FaEye, FaEdit, FaUserPlus, FaTrash } from "react-icons/fa";

function CompteGestionnaire() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [gestionnaire, setGestionnaire] = useState(null);
  const [formAjout, setFormAjout] = useState({ nom: "", email: "", motdepasse: "" });
  const [mode, setMode] = useState("voir");

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [ancien, setAncien] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
  const stored = localStorage.getItem("gestionnaire");
  if (stored) {
    try {
      const g = JSON.parse(stored);
      const gest = g.gestionnaire || g;
      setGestionnaire(gest);
      setNom(gest.nom);
      setEmail(gest.email);
    } catch (err) {
      console.error("Erreur parsing gestionnaire :", err);
    }
  }
}, []);

 const modifierInfos = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put(`${window.env.REACT_APP_API_URL}/api/gestionnaire/modifier-info-par-email/${gestionnaire.email}`, {
      nom,
      email,
    });
    alert("Informations mises à jour !");
    setGestionnaire(res.data.gestionnaire);
    localStorage.setItem("gestionnaire", JSON.stringify(res.data.gestionnaire));
  } catch (err) {
    alert(err.response?.data?.message || "Erreur lors de la mise à jour");
  }
};

const modifierMotDePasse = async (e) => {
  e.preventDefault();
  if (nouveau !== confirmation) {
    return alert("Les nouveaux mots de passe ne correspondent pas.");
  }

  try {
    const res = await axios.put(
      `${window.env.REACT_APP_API_URL}/api/gestionnaire/modifier-motdepasse-par-email/${gestionnaire.email}`,
      {
        ancienMotdepasse: ancien,
        nouveauMotdepasse: nouveau,
      }
    );
    alert(res.data.message);
    setAncien("");
    setNouveau("");
    setConfirmation("");
  } catch (err) {
    console.error(err); // Ajoute ce log pour voir l’erreur précise
    alert(err.response?.data?.message || "Erreur lors du changement de mot de passe");
  }
};

  const handleAjout = async () => {
    try {
      const res = await axios.post(`${window.env.REACT_APP_API_URL}/api/gestionnaire`, formAjout);
      alert("Nouveau gestionnaire ajouté");
      setFormAjout({ nom: "", email: "", motdepasse: "" });
      setMode("voir");
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  const handleSuppression = () => {
    if (!window.confirm("Voulez-vous vraiment supprimer votre compte ?")) return;
    axios.delete(`${window.env.REACT_APP_API_URL}/api/gestionnaire/email/${gestionnaire.email}`).then(() => {
      localStorage.removeItem("gestionnaire");
      alert("Compte supprimé");
      window.location.reload();
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        onClick={() => setPopupVisible(true)}
        className="flex items-center gap-2 bg-white px-5 py-3 rounded shadow cursor-pointer hover:bg-green-50"
      >
        <FaUserCircle className="text-3xl text-green-700" />
        <span className="font-bold text-green-800 text-lg">{gestionnaire?.nom || "..."}</span>
      </div>

      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transition-transform duration-300 z-50 ${
        popupVisible ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-green-700">Mon compte</h2>
          <button onClick={() => { setPopupVisible(false); setMode("voir"); }} className="text-red-600 font-bold text-lg">×</button>
        </div>

        <div className="flex flex-col items-center py-4 border-b">
          <FaUserCircle className="text-6xl text-green-600 mb-2" />
          <h3 className="text-lg font-semibold">{gestionnaire?.nom}</h3>

          <div className="flex justify-around w-full mt-4 border-t pt-4">
            <button onClick={() => setMode("voir")} className="flex flex-col items-center text-green-700 hover:text-green-900">
              <FaEye />
              <span className="text-xs">Voir</span>
            </button>
            <button onClick={() => setMode("modifier")} className="flex flex-col items-center text-blue-700 hover:text-blue-900">
              <FaEdit />
              <span className="text-xs">Modifier</span>
            </button>
            <button onClick={() => setMode("ajouter")} className="flex flex-col items-center text-green-600 hover:text-green-800">
              <FaUserPlus />
              <span className="text-xs">Ajouter</span>
            </button>
            <button onClick={handleSuppression} className="flex flex-col items-center text-red-600 hover:text-red-800">
              <FaTrash />
              <span className="text-xs">Supprimer</span>
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          {mode === "voir" && (
            <div className="space-y-2">
              <p><strong>Nom :</strong> {gestionnaire?.nom}</p>
              <p><strong>Email :</strong> {gestionnaire?.email}</p>
            </div>
          )}

          {mode === "modifier" && (
            <div className="space-y-6">
              <form onSubmit={modifierInfos} className="space-y-3">
                <h2 className="text-lg font-bold">Modifier mes informations</h2>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" className="w-full p-2 border rounded" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
              </form>

              <form onSubmit={modifierMotDePasse} className="space-y-3 border-t pt-4">
                <h2 className="text-lg font-bold">Modifier le mot de passe</h2>
                <input type="password" value={ancien} onChange={(e) => setAncien(e.target.value)} placeholder="Ancien mot de passe" className="w-full p-2 border rounded" />
                <input type="password" value={nouveau} onChange={(e) => setNouveau(e.target.value)} placeholder="Nouveau mot de passe" className="w-full p-2 border rounded" />
                <input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder="Confirmer le nouveau mot de passe" className="w-full p-2 border rounded" />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Modifier mot de passe</button>
              </form>
            </div>
          )}

          {mode === "ajouter" && (
            <form onSubmit={(e) => { e.preventDefault(); handleAjout(); }} className="space-y-2 mt-2">
              <input type="text" value={formAjout.nom} onChange={e => setFormAjout({ ...formAjout, nom: e.target.value })} placeholder="Nom" className="border p-2 w-full rounded" />
              <input type="email" value={formAjout.email} onChange={e => setFormAjout({ ...formAjout, email: e.target.value })} placeholder="Email" className="border p-2 w-full rounded" />
              <input type="password" value={formAjout.motdepasse} onChange={e => setFormAjout({ ...formAjout, motdepasse: e.target.value })} placeholder="Mot de passe" className="border p-2 w-full rounded" />
              <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">Ajouter</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompteGestionnaire;