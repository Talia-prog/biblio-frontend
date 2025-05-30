import React, { useState, useEffect } from "react";
import axios from "axios";
import EmpruntsEnCours from "./encours";
import LecteurCompte from "../comptelect";
import Logo from "../logo";
function PageLecteur() {
  const [livres, setLivres] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [livreSelectionne, setLivreSelectionne] = useState(null);
  const [suggestionPopupVisible, setSuggestionPopupVisible] = useState(false);
  const [rubriques, setRubriques] = useState([]);
  const [rubriqueActive, setRubriqueActive] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [pageEmprunts, setPageEmprunts] = useState(false);
  const [lecteur, setLecteur] = useState(null);
  const [form, setForm] = useState({ nom: "", poste: "" });
  const [suggestion, setSuggestion] = useState({ titre: "", auteur: "", date: "", nomAgent: "", commentaire: "" });

  useEffect(() => {
   const lecteur = JSON.parse(localStorage.getItem("lecteurConnecte")) || { nom: "", poste: "" };
  const info = localStorage.getItem("lecteurConnecte");
  if (info) {
    const lecteurData = JSON.parse(info);
    setLecteur(lecteurData);
    setForm({ nom: lecteurData.nom, poste: lecteurData.poste });
    setSuggestion((prev) => ({ ...prev, nomAgent: lecteurData.nom }));

    axios.get(`${window.env.REACT_APP_API_URL}/api/emprunts/encours/${lecteurData.nom}/${lecteurData.poste}`)
  .then(res => setEmprunts(res.data))
  .catch(err => console.error("Erreur récupération emprunts :", err));
  }

  axios.get(`${window.env.REACT_APP_API_URL}/api/livres`)
    .then((res) => {
      const tousLesLivres = res.data;
      setLivres(tousLesLivres);
      const uniqueRubriques = [...new Set(tousLesLivres.map((livre) => livre.rubrique))];
      setRubriques(uniqueRubriques);
    });

    
  }, []);

  const envoyerDemande = () => {
    if (!form.nom || !form.poste) {
      alert("Tous les champs sont obligatoires.");
      return;
    }
    axios.post(`${window.env.REACT_APP_API_URL}/api/demandes`, {
      nom: form.nom,
      poste: form.poste,
      titre: livreSelectionne.titre,
      idLivre: livreSelectionne._id,
      validé: false
    })
      .then(() => {
        alert("Demande envoyée !");
        setFormVisible(false);

        axios.get(`${window.env.REACT_APP_API_URL}/api/emprunts/encours/${form.nom}/${form.poste}`)
        .then(res=>setEmprunts(res.data));
      })
      .catch(() => alert("Erreur lors de l'envoi."));
  };

  const envoyerSuggestion = () => {
    if (!suggestion.titre || !suggestion.auteur || !suggestion.nomAgent) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }
    axios.post(`${window.env.REACT_APP_API_URL}/api/suggestions`, suggestion)
      .then(() => {
        alert("Suggestion envoyée !");
        setSuggestionPopupVisible(false);
        setSuggestion({ titre: "", auteur: "", date: "", nomAgent: lecteur.nom, commentaire: "" });
      })
      .catch(() => alert("Erreur lors de l'envoi."));
  };

  const livresFiltres = livres.filter(
    (livre) =>
      (!rubriqueActive || livre.rubrique === rubriqueActive) &&
      (livre.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        livre.auteur.toLowerCase().includes(recherche.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="flex justify-end mb-4"><LecteurCompte/></div>
      <div className="flex justify-between items-center mb-6">
        <header className="flex items-center justify-between p-4 bg-white border-b">
      <Logo size={80} />
      <h1 className="text-2xl font-semibold">Bienvenue {lecteur?.nom}</h1>
    </header>

        {/* <h1 className="text-3xl font-bold text-green-800">
          Bienvenue {lecteur?.nom || "dans la bibliothèque"}
        </h1> */}
        {/* <div className="flex gap-4">
          <div className="cursor-pointer text-4xl" onClick={() => setSuggestionPopupVisible(true)}>📫</div>
         
        </div> */}
        <div className="relative">
    {/* <button 
      onClick={() => setSuggestionPopupVisible(true)}
      className="flex items-center space-x-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg shadow mt-8 pt-2"
    >
     📫
      <span className="font-medium">Suggestions</span>
    </button> */}
  </div>

      </div>

      {pageEmprunts ? (
        <div>
          <button
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => setPageEmprunts(false)}
      >
        ← Retour aux livres
      </button>
          <EmpruntsEnCours nom={lecteur.nom} poste={lecteur.poste}/>
        </div>
      ) : (
        <div>
          <input type="text" placeholder="Rechercher un livre par titre ou auteur" className="w-full mb-6 p-2 border rounded" value={recherche} onChange={(e) => setRecherche(e.target.value)} />

          <div className="flex flex-wrap gap-3 mb-8">
            {rubriques.map((rubrique) => (
              <button key={rubrique} onClick={() => setRubriqueActive(rubrique)} className={`px-4 py-2 rounded-full border ${rubriqueActive === rubrique ? "bg-green-600 text-white" : "bg-white text-green-800 border-green-400 hover:bg-green-100"}`}>
                {rubrique}
              </button>
            ))}
            {rubriqueActive && (
              <button onClick={() => setRubriqueActive(null)} className="ml-2 px-3 py-1 text-sm bg-red-200 text-red-700 rounded">Réinitialiser</button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {livresFiltres.map((livre) => (
              <div key={livre._id} className="relative bg-white border rounded-lg p-4 shadow hover:shadow-md transition">
                <div className="h-32 bg-gray-200 mb-2 rounded flex items-center justify-center text-gray-400">
                  <span>📖</span>
                </div>
                {!livre.disponible && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Emprunté</div>
                )}
                <h3 className="font-semibold text-lg text-green-800 mb-1">{livre.titre}</h3>
                <p className="text-gray-600 text-sm">{livre.auteur}</p>
                {livre.disponible && (
                  <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" onClick={() => { setLivreSelectionne(livre); setFormVisible(true); }}>Demander</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {formVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Demande d’emprunt</h3>
            <p className="text-sm mb-2">Nom : {form.nom}</p>
            <p className="text-sm mb-4">Poste : {form.poste}</p>
            <div className="flex justify-between">
              <button className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400" onClick={() => setFormVisible(false)}>Annuler</button>
              <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700" onClick={envoyerDemande}>Envoyer</button>
            </div>
          </div>
        </div>
      )}

      {suggestionPopupVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-3 text-green-700">Suggérez de nouveaux livres à la bibliothèque</h2>
            <input type="text" placeholder="Titre *" className="w-full mb-2 p-2 border rounded" value={suggestion.titre} onChange={(e) => setSuggestion({ ...suggestion, titre: e.target.value })} />
            <input type="text" placeholder="Auteur *" className="w-full mb-2 p-2 border rounded" value={suggestion.auteur} onChange={(e) => setSuggestion({ ...suggestion, auteur: e.target.value })} />
            <input type="text" placeholder="Date de publication" className="w-full mb-2 p-2 border rounded" value={suggestion.date} onChange={(e) => setSuggestion({ ...suggestion, date: e.target.value })} />
            <input type="text" placeholder="votre nom" readOnly className="w-full mb-2 p-2 border rounded" value={suggestion.nomAgent} onChange={(e) => setSuggestion({ ...suggestion, nomAgent: e.target.value })} />
            <textarea placeholder="Commentaire (optionnel)" className="w-full mb-2 p-2 border rounded" value={suggestion.commentaire} onChange={(e) => setSuggestion({ ...suggestion, commentaire: e.target.value })} />
            <div className="flex justify-between">
              <button className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400" onClick={() => setSuggestionPopupVisible(false)}>Annuler</button>
              <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700" onClick={envoyerSuggestion}>Envoyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageLecteur;