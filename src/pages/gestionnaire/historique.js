import React from "react";
import "./gestion.css";

function HistoriqueEmprunts() {
  const historique = [
    { id: 1, nom: "Ali", livre: "Fables", dateEmprunt: "2024-03-01", dateRetour: "2024-03-15" }
  ];

  return (
    <div className="page-gestion">
      <h2>Historique des emprunts</h2>
      <ul className="liste">
        {historique.map((e) => (
          <li key={e.id}>
            <span>{e.nom} a emprunté <strong>{e.livre}</strong> du {e.dateEmprunt} au {e.dateRetour}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoriqueEmprunts;