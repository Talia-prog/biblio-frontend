import React, { useState, useEffect, useRef } from 'react';
import { UserCircle } from 'lucide-react';
import axios from 'axios';
import EmpruntsEnCours from "./lecteur/encours";
import { useNavigate } from "react-router-dom";
import ChangerMotDePasse from './connexion/changelect';
const CompteLecteur = () => {
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const navigate = useNavigate();
  const lecteur = JSON.parse(localStorage.getItem("lecteurConnecte"));
  const [isOpen, setIsOpen] = useState(false);
  const [emprunts, setEmprunts] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [Lecteur, setLecteur] = useState(null);
  const [pageEmprunts, setPageEmprunts] = useState(false);
  const [formData, setFormData] = useState({
    nom: lecteur?.nom || '',
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmation: ''
  });
  const [message, setMessage] = useState("");

  const panelRef = useRef(null);

  const handleClickOutside = (event) => {
    if (panelRef.current && !panelRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  useEffect(()=>{
    const info = localStorage.getItem("lecteurConnecte");
  if (info) {
    const lecteurData = JSON.parse(info);
    setLecteur(lecteurData);
    axios.get(`${process.env.REACT_APP_API_URL}/api/emprunts/encours/${lecteurData.nom}/${lecteurData.poste}`)
  .then(res => setEmprunts(res.data))
  .catch(err => console.error("Erreur récupération emprunts :", err));
  }
  })
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModification = async () => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/lecteurs/modifier-info/${lecteur._id}`, formData);
      const updatedlecteur=res.data.lecteur;
      localStorage.setItem("lecteurConnecte",JSON.stringify(updatedlecteur));
      setLecteur(updatedlecteur);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleSuppression = async () => {

    if (!window.confirm("Confirmer la suppression de votre compte ?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/lecteurs/${lecteur._id}`);
      localStorage.removeItem("lecteurConnecte");
      window.location.href = "/";
      navigate("/connexion-lecteur")
    } catch (err) {
      setMessage("Erreur lors de la suppression");
    }
  };

  return (
    <>
      {/* Bouton fixe en haut à droite */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 cursor-pointer" onClick={() => setIsOpen(true)}>
        <UserCircle className="w-8 h-8 text-blue-600" />
        <span className="font-semibold text-blue-700">{lecteur?.nom}</span>
      </div>

      {/* Overlay semi-transparent */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-25" />
      )}

      {/* Panneau latéral */}
      {isOpen && (
        <div ref={panelRef} className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl z-50 flex flex-col">
          {/* En-tête */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <UserCircle className="w-8 h-8 text-blue-600" />
              <span className="text-lg font-semibold">{lecteur?.nom}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 text-xl font-bold hover:text-red-500">&times;</button>
          </div>

          {/* Navigation */}
          <div className="flex justify-around border-b p-2 bg-gray-50">
            <button onClick={() => setActiveTab("infos")} className={`px-2 py-1 text-sm ${activeTab === "infos" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>
              Infos
            </button>
            <button onClick={() => setActiveTab("modifier")} className={`px-2 py-1 text-sm ${activeTab === "modifier" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>
              Modifier
            </button>
            <button onClick={() => setActiveTab("emprunts")} className={`px-2 py-1 text-sm ${activeTab === "emprunts" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>
              Emprunts
            </button>
            <button onClick={handleSuppression} className="text-sm text-red-600 hover:underline">Supprimer</button>
          </div>

          {/* Contenu */}
          <div className="flex-1 p-4 overflow-y-auto">
            {message && <p className="text-sm text-center text-red-600 mb-2">{message}</p>}

            {activeTab === "infos" && (
              <div className="space-y-2 text-sm">
                <p><strong>Nom :</strong> {lecteur?.nom}</p>
                <p><strong>Email :</strong> {lecteur?.email}</p>
              </div>
            )}

            {activeTab === "modifier" && (
              <div className="space-y-3">
                <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="border p-2 w-full rounded" />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="email" className="border p-2 w-full rounded" />
                <hr />
                <button onClick={() => setAfficherFormulaire(!afficherFormulaire)} className="text-blue-600 underline">
  Modifier mot de passe
</button>

{afficherFormulaire && <ChangerMotDePasse />}
                <button onClick={handleModification} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Valider</button>
              </div>
            )}

            {activeTab === "emprunts" && (
              <div>
                        <EmpruntsEnCours nom={Lecteur.nom} poste={Lecteur.poste}/>
                      </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CompteLecteur;