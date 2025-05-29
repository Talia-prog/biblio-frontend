import React, { useState } from "react";
import "./gestion.css";

function DemandesEmprunt() {
  const [demandes, setDemandes] = useState([
    {
      id: 1,
      lecteur: { nom: "Alice", poste: "Stagiaire" },
      livre: { titre: "Clean Code", auteur: "Robert C. Martin", rubrique: "Informatique" },
      duree: ""
    }
  ]);

  const valider = (id, duree) => {
    if (!duree) {
      alert("Veuillez entrer une durée.");
      return;
    }
    alert(`Demande validée pour ${duree} jours`);
    setDemandes(demandes.filter((d) => d.id !== id));
  };

  const refuser = (id) => {
    alert("Demande refusée.");
    setDemandes(demandes.filter((d) => d.id !== id));
  };

  const handleDuree = (id, valeur) => {
    setDemandes(demandes.map((d) => d.id === id ? { ...d, duree: valeur } : d));
  };

  return (
    <div className="page-gestion">
      <h2>Demandes d’emprunt</h2>
      <ul className="liste">
        {demandes.map((dem) => (
          <li key={dem.id}>
            <div>
              <p><strong>{dem.lecteur.nom}</strong> ({dem.lecteur.poste})</p>
              <p>Livre : <em>{dem.livre.titre}</em> par {dem.livre.auteur} - {dem.livre.rubrique}</p>
              <input type="number" placeholder="Durée (jours)" value={dem.duree} onChange={(e) => handleDuree(dem.id, e.target.value)} />
            </div>
            <div>
              <button onClick={() => valider(dem.id, dem.duree)}>Valider</button>
              <button onClick={() => refuser(dem.id)} className="danger">Refuser</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DemandesEmprunt;