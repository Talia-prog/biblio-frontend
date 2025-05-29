
import React from "react";
import "./gestion.css";

function EmpruntsEnCours() {
  const emprunts = [
    { id: 1, nom: "Jean", livre: "L'Étranger", dateDebut: "2024-04-10", duree: 14 }
  ];

  return (
    <div className="page-gestion">
      <h2>Emprunts en cours</h2>
      <ul className="liste">
        {emprunts.map((e) => (
          <li key={e.id}>
            <span>{e.nom} - <strong>{e.livre}</strong> (Début : {e.dateDebut} / Durée : {e.duree} jours)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmpruntsEnCours;