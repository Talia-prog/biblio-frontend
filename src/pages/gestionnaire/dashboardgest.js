import React, { useState, useEffect } from "react"; 
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CompteGestionnaire from "../comptegest";
import ExportEmprunts from "./export";
import Logo from "../logo";
import Statistiques from "./stats";
// import { updateSearchIndex } from "../../../../models/livres";

function PageGestionnaire() {
  const [motifs, setMotifs] = useState({});
const [demandeRefusEnCours, setDemandeRefusEnCours] = useState(null);
const [demandesRefusees, setDemandesRefusees] = useState({});
const [formModif, setFormModif] = useState({id: "", titre: "", auteur: "", datePubli: "",editeurs: ""});
  const [popupRubrique, setPopupRubrique] = useState(false);
const [nouvelleRubrique, setNouvelleRubrique] = useState("");
  const [nouvelleSuggestion, setNouvelleSuggestion] = useState(false);
const [nouvelleDemande, setNouvelleDemande] = useState(false);
  const [ongletActif, setOngletActif] = useState("accueil"); 
  const [rubriques, setRubriques] = useState([]); 
  const [livres, setLivres] = useState([]); 
  const [rubriqueActive, setRubriqueActive] = useState(""); 
  const [formVisible, setFormVisible] = useState(false); 
  const [modificationId, setModificationId] = useState(null); 
  // const [formModif, setFormModif] = useState({}); 
  const [nouveauLivre, setNouveauLivre] = useState({ id: "", titre: "", auteur: "", datepublication: "", rubrique: "", editeurs: "", exemplaires: 1, disponible: true, });
  const [suggestions, setSuggestions] = useState([]); 
  const [demandes, setDemandes] = useState([]); 
  const [durees, setDurees] = useState({}); 
  const [demandesValidees, setDemandesValidees] = useState({}); 
  // const [empruntsEnCours, setEmpruntsEnCours] = useState([]); 
  const [historiqueEmprunts, setHistoriqueEmprunts] = useState([]); 
  const [rechercheEmprunt, setRechercheEmprunt] = useState(""); 
  const [rechercheLivre, setRechercheLivre]=useState("");
  const [stats, setStats] = useState({});
  const [emprunts, setEmprunts]=useState([]);
  const[dateretour, setDateRetour]=useState({});

useEffect(() => { 
  axios.get(`${window.env.REACT_APP_API_URL}/api/livres`)
  .then(res => setLivres(res.data)); 
  axios.get(`${window.env.REACT_APP_API_URL}/api/rubriques`)
  .then(res => setRubriques(res.data));

// if (ongletActif === "suggestions") {
//   axios.get(`${window.env.REACT_APP_API_URL}/api/suggestions")
//   .then(res => setSuggestions(res.data));
// }
if (ongletActif === "demandes") {
  axios.get(`${window.env.REACT_APP_API_URL}/api/demandes`)
  .then(res => setDemandes(res.data));
}

if (ongletActif === "enCours") {
  if (ongletActif === "enCours") {
    axios.get(`${window.env.REACT_APP_API_URL}/api/emprunts/encours`)
      .then(res => setEmprunts(res.data))
      .catch(err => console.error("Erreur chargement emprunts en cours:", err));
  }

}
if (ongletActif === "historique") {
  axios.get(`${window.env.REACT_APP_API_URL}/api/emprunts/historique`)
    .then(res => setHistoriqueEmprunts(res.data));
}
if (ongletActif === "stats") {
  axios.get(`${window.env.REACT_APP_API_URL}/api/statistiques`)
  .then(res => setStats(res.data));
}
//  if (ongletActif !== "suggestions") {
//     axios.get("${window.env.REACT_APP_API_URL}/api/suggestions")
//       .then(res => {
//         const suggestions = res.data;
//         const derniereConsultation = localStorage.getItem("derniereConsultSuggestion");
//         const nouvelles = suggestions.filter(s => new Date(s.date) > new Date(derniereConsultation));
//         setNouvelleSuggestion(nouvelles.length > 0);
//       });
//   } else {
//     localStorage.setItem("derniereConsultSuggestion", new Date());
//     setNouvelleSuggestion(false);
//   }
if (ongletActif !== "demandes") {
    axios.get(`${window.env.REACT_APP_API_URL}/api/demandes`)
      .then(res => {
        const demandes = res.data;
        const derniereConsultation = localStorage.getItem("derniereConsultDemande");
        const nouvelles = demandes.filter(d => new Date(d.createdAt) > new Date(derniereConsultation));
        setNouvelleDemande(nouvelles.length > 0);
      });
  } else {
    localStorage.setItem("derniereConsultDemande", new Date());
    setNouvelleDemande(false);
  }


}, [ongletActif]);
// useEffect(() => {
//   axios.get("${window.env.REACT_APP_API_URL}/api/gestionnaire/compte") // à adapter selon ton API
//     .then(res => setGestionnaire(res.data))
//     .catch(err => console.error("Erreur compte gestionnaire :", err));
// }, []);
const enregistrerNouveauLivre = () => { 
  axios.post(`${window.env.REACT_APP_API_URL}/api/livres`, { ...nouveauLivre, rubrique: rubriqueActive }) 
  .then(() => { alert("Livre ajouté"); 
    setFormVisible(false); 
    setNouveauLivre({ id: "", titre: "", auteur: "", datepublication: "", rubrique: rubriqueActive, editeurs: "", exemplaires: 1, disponible: true }); 
    return axios.get(`${window.env.REACT_APP_API_URL}/api/livres`); }) 
    .then(res => setLivres(res.data)); 
  };

const enregistrerModificationLivre = (id) => { 
  axios.put(`${window.env.REACT_APP_API_URL}/api/livres/${id}`, formModif) 
  .then(() => { alert("Livre modifié"); 
    setModificationId(null); 
    setFormModif({}); 
    return axios.get(`${window.env.REACT_APP_API_URL}/api/livres`); 
  }) 
  .then(res => setLivres(res.data)); 
};

const validerDemande = async (demandeId, livreId) => {
  const duree = durees[demandeId];
  if (!duree) {
    alert("Veuillez entrer une durée d'emprunt.");
    return;
  }

  try {
    const res = await axios.post(`${window.env.REACT_APP_API_URL}/api/emprunts`, {
      demandeId,
      livreId,
      duree,
    });

    if (res.status === 200 || res.status === 201) {
      alert("Demande validée avec succès !");
      setDemandesValidees((prev) => ({ ...prev, [demandeId]: true }));
    } else {
      alert("Échec de la validation.");
    }
  } catch (error) {
    console.error("Erreur lors de la validation :", error.response?.data || error.message);
    alert("Erreur réseau ou serveur lors de la validation.");
  }
};

const refuserDemande = async (idDemande, motif) => {
  if (!motif) return alert("Veuillez indiquer un motif de refus.");

  try {
    await axios.post(`${window.env.REACT_APP_API_URL}/api/demandes/refuser`, {
      idDemande,
      motif,
    });

    setDemandesRefusees((prev) => ({ ...prev, [idDemande]: true }));
    setDemandeRefusEnCours(null);
    alert("Demande refusée avec succès !");
  } catch (err) {
    alert("Erreur lors du refus.");
    console.error(err);
  }
};

const enregistrerRetour = async (id) => {
  const date = dateretour[id];
  if (!date) {
    alert("Veuillez choisir une date de retour.");
    return;
  }

  try {
    await axios.put(`${window.env.REACT_APP_API_URL}/api/emprunts/${id}/retour`, {
      dateretour: date,
    });

    alert("Retour enregistré !");
    setEmprunts(prev => prev.filter(e => e._id !== id));
    const newState = { ...dateretour };
    delete newState[id];
    setDateRetour(newState);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'enregistrement du retour.");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Voulez-vous vraiment supprimer ce livre ?")) return;

  try {
    const res = await fetch(`${window.env.REACT_APP_API_URL}/api/livres/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert("Livre supprimé.");
      // Met à jour la liste des livres localement (sans recharger)
      setLivres((prev) => prev.filter(livre => livre._id !== id));
    } else {
      alert("Erreur lors de la suppression.");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Erreur réseau.");
  }
};

const exporterLivresPDF = async () => {
  try {
    const res = await axios.get(`${window.env.REACT_APP_API_URL}/api/livres/avec-lecteurs`);
    let livres = res.data;

    const doc = new jsPDF();
    doc.setFont("times", "normal");

    doc.text("Catalogue de la bibliothèque", 14, 15);

    // Trier uniquement par ID (ordre alphabétique)
    livres.sort((a, b) => {
      const idA = (a.id || "").toLowerCase();
      const idB = (b.id || "").toLowerCase();
      return idA.localeCompare(idB);
    });

    const rows = livres.map(livre => ([
      livre.id || "",
      livre.titre || "",
      livre.auteur || "",
      livre.datepublication || "",
      livre.rubrique || "",
      livre.editeurs || "",
      livre.disponible ? "Oui" : "Non",
      livre.nomLecteur || ""
    ]));

    doc.autoTable({
      startY: 20,
      head: [["ID", "Titre", "Auteur", "Date", "Rubrique", "Éditeur", "Disponible", "Lecteur"]],
      body: rows,
      styles: {
        fontSize: 9,
        font: "times",
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 20 },
        7: { cellWidth: 30 },
      },
      didParseCell: function (data) {
        const disponible = data.row.raw[6];
        if (disponible === "Non") {
          data.cell.styles.textColor = [200, 0, 0];
        }
      }
    });

    doc.save("catalogue_bibliotheque.pdf");
  } catch (err) {
    console.error("Erreur export catalogue :", err);
    alert("Erreur lors de l'exportation.");
  }
};
const onglets = [
  { nom: "Gestion des livres", valeur: "livres", image: "https://img.icons8.com/fluency/96/books.png" },
  { nom: "Demandes d'emprunts", valeur: "demandes", image: "https://img.icons8.com/fluency/96/sms.png" },
  { nom: "Emprunts en cours", valeur: "enCours", image: "https://img.icons8.com/fluency/96/time-machine.png" },
  { nom: "Historique des emprunts", valeur: "historique", image: "https://img.icons8.com/fluency/96/timeline-week.png" },
  // { nom: "Suggestions des lecteurs", valeur: "suggestions", image: "https://img.icons8.com/fluency/96/cloud.png" },
  { nom: "Statistiques d'utilisation", valeur: "stats", image: "https://img.icons8.com/fluency/96/combo-chart.png" },
  
];

return ( 
<div className="p-6 bg-green-50 min-h-screen"> 
  <div className="flex justify-end mb-4"><CompteGestionnaire/></div>
  <div className="p-2 bg-white shadow-md flex items-center">
    <div className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center">
      <Logo size={80} />
    </div>
    <h1 className="ml-4 text-xl font-bold text-gray-700">OpenShelf BEAC</h1>
  </div>

  {/* <header className="flex items-center justify-between p-4 bg-white border-b">
        <Logo size={80} />
        
      </header> */}
{ongletActif === "accueil" ? (
        <>
          <h1 className="text-4xl font-bold text-center text-green-900 mb-10">Tableau de bord du gestionnaire</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {onglets.map((onglet) => (
              <div
  key={onglet.valeur}
  onClick={() => setOngletActif(onglet.valeur)}
  className="relative cursor-pointer flex flex-col items-center p-6 border rounded-lg shadow hover:bg-green-100 transition"
>
  {onglet.valeur === "demandes" && nouvelleDemande && (
    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
  )}
  {/* {onglet.valeur === "suggestions" && nouvelleSuggestion && (
    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
  )} */}
  <img src={onglet.image} alt={onglet.nom} className="w-16 h-16 mb-3" />
  <span className="text-center font-semibold text-green-800">{onglet.nom}</span>
</div>
              // <div
              //   key={onglet.valeur}
              //   onClick={() => setOngletActif(onglet.valeur)}
              //   className="cursor-pointer flex flex-col items-center p-6 border rounded-lg shadow hover:bg-green-100 transition"
              // >
              //   <img src={onglet.image} alt={onglet.nom} className="w-16 h-16 mb-3" />
              //   <span className="text-center font-semibold text-green-800">{onglet.nom}</span>
              // </div>
            ))}
          </div>
        </>
   ) : ( <div className="bg-white rounded shadow p-6"> <button onClick={() => setOngletActif("accueil")} className="mb-4 text-green-700 hover:underline">← Retour</button>

{ongletActif === "livres" && (
        <>
          <h2 className="text-xl font-bold text-green-800 mb-4">Livres par rubrique</h2>
          <button
  onClick={() => setPopupRubrique(true)}
  className="bg-green-600 text-white px-3 py-1 rounded mb-3 ml-3"
>
  + Ajouter une rubrique
</button>
{popupRubrique && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-green-800">Nouvelle rubrique</h2>
      <input
        type="text"
        placeholder="Nom de la rubrique"
        value={nouvelleRubrique}
        onChange={(e) => setNouvelleRubrique(e.target.value)}
        className="border p-2 w-full rounded mb-3"
      />
      <div className="flex justify-end gap-2">
        <button
          className="bg-gray-300 px-4 py-1 rounded"
          onClick={() => {
            setNouvelleRubrique("");
            setPopupRubrique(false);
          }}
        >
          Annuler
        </button>
        <button
          className="bg-green-600 text-white px-4 py-1 rounded"
          onClick={() => {
            if (!nouvelleRubrique) return alert("Veuillez entrer un nom.");
            setRubriqueActive(nouvelleRubrique);
            setPopupRubrique(false);
            setFormVisible(true);
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
)}
          {!rubriqueActive ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {rubriques.map(r => (
                <div key={r} onClick={() => setRubriqueActive(r)} className="border p-3 text-center rounded cursor-pointer hover:bg-green-100">{r}</div>
              ))}
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-green-700 mb-2">Rubrique : {rubriqueActive}</h3>
              <button onClick={() => setRubriqueActive("")} className="mb-4 text-sm text-green-600 underline">← Retour aux rubriques</button>
              <button onClick={() => setFormVisible(true)} className="bg-green-600 text-white px-3 py-1 rounded mb-3">+ Ajouter un livre</button>
              <input
  type="text"
  placeholder="Rechercher un livre par titre, auteur ou éditeur"
  className="mb-4 border rounded p-2 w-full"
  value={rechercheLivre}
  onChange={(e) => setRechercheLivre(e.target.value)}
/>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                 
  {livres
    .filter((l) => 
      l.rubrique === rubriqueActive &&(
         l.titre.toLowerCase().includes(rechercheLivre.toLowerCase()) ||
    l.auteur.toLowerCase().includes(rechercheLivre.toLowerCase()) ||
    l.editeurs.toLowerCase().includes(rechercheLivre.toLowerCase())

      )
  )
    .map((l) => (
      <div key={l._id} className="border rounded p-3 shadow bg-white">
        <p className="text-sm">ID: {l.id}</p>
        <h4 className="font-bold text-green-800">{l.titre}</h4>
        <p className="text-sm">Auteur : {l.auteur}</p>
        <p className="text-sm">Éditeur : {l.editeurs}</p>
        <p className="text-sm">Date de publication : {l.datePubli}</p>
        <p className="text-sm">
          Statut :{" "}
          <span className={l.disponible ? "text-green-600" : "text-red-500"}>
            {l.disponible ? "Disponible" : "Indisponible"}
          </span>
        </p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={() => {
              setModificationId(l._id);
              setFormModif(l);
            }}
            className="text-green-600 text-sm underline"
          >
            Modifier
          </button>
          <button
  onClick={() => handleDelete(l._id)}
  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
>
  Supprimer
</button>
        </div>
      </div>
    ))}
</div>

{/* MODAL DE MODIFICATION */}
{modificationId && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Modifier le livre</h3>
      {["id","titre", "auteur", "datepublication", "editeurs"].map((champ) => (
        <input
          key={champ}
          type="text"
          placeholder={champ}
          value={formModif[champ] || ""}
          onChange={(e) =>
            setFormModif({ ...formModif, [champ]: e.target.value })
          }
          className="w-full mb-3 p-2 border rounded"
        />
      ))}
      <div className="flex justify-end gap-3">
        <button
          className="bg-gray-300 px-4 py-1 rounded"
          onClick={() => setModificationId(null)}
        >
          Annuler
        </button>
        <button
          className="bg-green-600 text-white px-4 py-1 rounded"
          onClick={() => enregistrerModificationLivre(modificationId)}
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
)}

              {formVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
      <h3 className="text-lg font-bold text-green-800 mb-4">
        Nouveau livre dans la rubrique : {rubriqueActive}
      </h3>
      <div className="space-y-3">
        {["id", "titre", "auteur", "datepublication", "editeurs"].map((champ) => (
          <input
            key={champ}
            type="text"
            placeholder={champ}
            value={nouveauLivre[champ]}
            onChange={(e) =>
              setNouveauLivre({ ...nouveauLivre, [champ]: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        ))}
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="px-4 py-1 rounded bg-gray-300"
          onClick={() => setFormVisible(false)}
        >
          Annuler
        </button>
        <button
          className="px-4 py-1 rounded bg-green-600 text-white"
          onClick={enregistrerNouveauLivre}
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
)}
            </>
          )}
        </>
      )}

      {ongletActif === "demandes" && (
        <>
          <h2 className="text-xl font-bold text-green-800 mb-4">Demandes d'emprunts</h2>
          {demandes.map((d) => (
  <div key={d._id} className="border p-3 rounded mb-3 shadow">
    <p className="font-semibold">Livre : {d.titre}</p>
    <p>Nom : {d.nom}</p>
    <p>Poste : {d.poste}</p>

    {!d.valide && !demandesRefusees[d._id] ? (
  <div className="mt-2 flex flex-col gap-2">
    <div className="flex gap-2">
      <input
        type="number"
        placeholder="Durée (jours)"
        value={durees[d._id] || ""}
        onChange={(e) =>
          setDurees({ ...durees, [d._id]: e.target.value })
        }
        className="border rounded p-1 w-1/2"
      />
      <button
        onClick={() => validerDemande(d._id, d.idLivre)}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Valider
      </button>
    </div>

    {demandeRefusEnCours === d._id ? (
      <>
      <div className=" flex gap-2">
        <input
          type="text"
          placeholder="Motif du refus"
          value={motifs[d._id] || ""}
          onChange={(e) =>
            setMotifs({ ...motifs, [d._id]: e.target.value })
          }
          className="border rounded p-1"
        />
        <button
          onClick={() => refuserDemande(d._id, motifs[d._id])}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Confirmer le refus
        </button>
        </div>
      </>
    ) : (
      <div className=" flex gap-2">
      <button
        onClick={() => setDemandeRefusEnCours(d._id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Refuser
      </button>
      </div>
    )}
  </div>
) : (
  <span className={`font-semibold ${d.valide ? "text-green-600" : "text-red-600"}`}>
    {d.valide ? "Demande validée" : "Demande refusée"}
  </span>
)}
  </div>
))}
        </>
      )}

      {ongletActif === "enCours" && (
        <>
         <h2 className="text-xl font-bold text-green-800 mb-4">Emprunts en cours</h2>
{emprunts.length === 0 ? (
  <p className="text-gray-500">Aucun emprunt en cours</p>
) : (
  
  emprunts.map(e => (
    <div key={e._id} className="border p-3 rounded mb-3 shadow">
      
      <p><strong>Lecteur :</strong> {e.nom} ({e.poste})</p>
      <p><strong>Livre :</strong> {e.idLivre?.titre}</p>
      <p><strong>Date d'emprunt :</strong> {new Date(e.dateemprunt).toLocaleDateString()}</p>
      <p><strong>Durée de l'emprunt :</strong> {e.duree} jours</p>
      <input
        type="date"
        value={dateretour[e._id] || ''}
        onChange={(ev) => setDateRetour(prev=>({...prev,[e._id]:ev.target.value}))}
        className="border p-1 mt-2"
      />
      <button
        onClick={() => enregistrerRetour(e._id)}
        className="ml-2 bg-green-600 text-white px-3 py-1 rounded"
      >
        Enregistrer retour
      </button>
    </div>
  ))
)}
          {/* {empruntsEnCours.filter(e => e.nom.toLowerCase().includes(rechercheEmprunt.toLowerCase()) || e.titre.toLowerCase().includes(rechercheEmprunt.toLowerCase())).map(e => (
            <div key={e._id} className="border rounded p-3 mb-2">
              <p><strong>{e.nom}</strong> - {e.titre}</p>
              <p>Date début : {e.dateDebut}</p>
              <p>Durée : {e.duree} jours</p>
              <input type="date" onChange={(ev) => enregistrerRetour(e._id, ev.target.value)} className="mt-2 border rounded p-1" />
            </div>
          ))} */}
        </>
      )}

{ongletActif === "historique" && (
  <>
    <div className="section-export"><ExportEmprunts/></div>

    <input
      type="text"
      placeholder="Rechercher par nom, titre ou date..."
      className="mb-4 border rounded p-2 w-full"
      value={rechercheEmprunt}
      onChange={(e) => setRechercheEmprunt(e.target.value)}
    />

    {historiqueEmprunts
      .filter(e =>
        e.nom.toLowerCase().includes(rechercheEmprunt.toLowerCase()) ||
        e.titreLivre?.toLowerCase().includes(rechercheEmprunt.toLowerCase()) ||
        e.dateretour?.toString().includes(rechercheEmprunt)
      )
      .map(e => (
        <div key={e._id} className="border p-4 rounded shadow mb-3 bg-gray-50">
          <p><strong>Lecteur :</strong> {e.nom} ({e.poste})</p>
          <p><strong>Livre :</strong> {e.idLivre?.titre}</p>
          <p><strong>Date d’emprunt :</strong> {new Date(e.dateemprunt).toLocaleDateString()}</p>
          <p><strong>Date de retour :</strong> {new Date(e.dateretour).toLocaleDateString()}</p>
        </div>
      ))}
  </>
)}

      {/* {ongletActif === "suggestions" && (
        <>
          <h2 className="text-xl font-bold text-green-800 mb-4">Suggestions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((s, i) => (
              <div key={i} className="border p-3 rounded shadow bg-amber-50">
                <h4 className="text-green-800 font-semibold">{s.titre}</h4>
                <p>Auteur : {s.auteur}</p>
                <p>Date : {s.date}</p>
                <p>Nom Agent : {s.nomAgent}</p>
                {s.commentaire && <p className="italic mt-1">“{s.commentaire}”</p>}
              </div>
            ))}
          </div>
        </>
      )} */}
      
{ongletActif === "stats" && (
  <>
    <h2 className="text-xl font-bold text-green-800 mb-4">Statistiques d'utilisation</h2>
    <button onClick={exporterLivresPDF} className="bg-green-600 text-white px-4 py-2 rounded">
  Exporter le catalogue
</button>
{/* <div className="space-y-2 mb-6">
  <Statistiques/>
</div> */}
    {/* <ul className="space-y-2 mb-6">
      <li><strong>Total de livres :</strong> {stats.totalLivres}</li>
      <li><strong>Total d’emprunts :</strong> {stats.totalEmprunts}</li>
      <li><strong>Total de suggestions :</strong> {stats.totalSuggestions}</li>
    </ul> */}

    <h3 className="text-lg font-semibold text-green-700 mt-4 mb-2">Répartition des livres par rubrique :</h3>
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {stats.repartition && Object.entries(stats.repartition).map(([rubrique, count]) => (
        <li key={rubrique} className="bg-green-100 rounded p-2 shadow text-center">
          <strong>{rubrique}</strong> : {count}
        </li>
      ))}
    </ul>
    
    {/* <button
  onClick={exporterLivresPDF}
  className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
  Exporter la liste des livres (PDF)
</button> */}
  </>
)}
    </div>
  )}
</div>

); }

export default PageGestionnaire;